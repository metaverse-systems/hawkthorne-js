import { System } from '@metaverse-systems/libecs-js';
import SpriteSheet from './SpriteSheet';

class DrawingSystem extends System
{
  constructor(config)
  {
    if(config === undefined) {
      config = {};
    }

    super(config);
    this.Handle = "DrawingSystem";
    this.tilesheets = {};
    this.config.camera = { x: 0, y: 0 };
  }

  Init = () => {
    this.Container.Components["TilesheetComponent"] = {};
    this.Container.Components["TileComponent"] = {};
    this.Container.Components["PositionComponent"] = {};
    this.Container.Components["SpriteComponent"] = {};
    this.Container.Components["StaticSpriteComponent"] = {};
    this.Container.Components["PolygonComponent"] = {};
    this.Container.Components["PolylineComponent"] = {};
    this.Container.Components["RectangleComponent"] = {};
    this.Container.Components["CurrentSceneComponent"] = {};
    this.Container.Components["SceneComponent"] = {};
  }

  ConfigUpdate = (config) => {
    Object.keys(config).forEach((key) => {
      this.config[key] = config[key];
    });
    if(config.width) this.config.board.width = this.config.width;
    if(config.height) this.config.board.height = this.config.height;
  }

  ShouldDraw = (x, y, width, height) => {
    const viewport = { left: this.config.camera.x,
                     top: this.config.camera.y,
                     right: (parseInt(this.config.camera.x) + parseInt(this.config.board.width)),
                     bottom: (parseInt(this.config.camera.y) + parseInt(this.config.board.height)) };

    const o = { left: x,
              top: y,
              right: (parseInt(x) + parseInt(width)),
              bottom: (parseInt(y) + parseInt(height)) };

    if(o.right < viewport.left) {
      return false;
    }

    if(o.left > viewport.right) {
      return false;
    }

    return true;
  }

  Update = () => {
//    this.DeltaTimeGet();
    if(this.config.board === undefined) return;
    const ctx = this.config.board.getContext("2d");

    ctx.clearRect(0, 0, this.config.board.width, this.config.board.height);

    const Tilesheets = this.Container.Components["TilesheetComponent"];
    if(Tilesheets !== undefined)
    Object.keys(Tilesheets).forEach((entity) => {
      const tilesheet = Tilesheets[entity];

      if(this.tilesheets[tilesheet.url] !== undefined) return;
      console.log("Loading tilesheet");
      console.log(tilesheet);
      this.tilesheets[tilesheet.url] = new SpriteSheet(this.config.board, tilesheet.url,
                                                       tilesheet.width, tilesheet.height);

      console.log(this.tilesheets);
      this.Container.EntityDestroy(entity);
    });

    let scene = "";
    const CurrentScenes = this.Container.Components["CurrentSceneComponent"];
    if(CurrentScenes !== undefined)
    Object.keys(CurrentScenes).forEach((entity) => {
      scene = CurrentScenes[entity].scene;
    });

    if(!scene) return;

    const Scenes = this.Container.Components["SceneComponent"];
    if(Scenes !== undefined)
    Object.keys(Scenes).forEach((entity) => {
      if(scene !== Scenes[entity].scene) return;

      const pos = this.Container.Components["PositionComponent"][entity];
      if(pos === undefined) return;

      const rect = this.Container.Components["RectangleComponent"][entity];
      if(rect) {
        ctx.beginPath();
        ctx.fillStyle = rect.color;
        ctx.rect(pos.x - this.config.camera.x, pos.y - this.config.camera.y, rect.width, rect.height);
        ctx.fill();
      }

      const tile = this.Container.Components["TileComponent"][entity];
      if(tile) {
        const sheet = this.tilesheets[tile.tilesheet];
        if(!sheet) return;

        if(this.ShouldDraw(pos.x * tile.width, pos.y * tile.height, tile.width, tile.height)) {
          sheet.draw(tile.x, tile.y, (pos.x * tile.width) - this.config.camera.x, (pos.y * tile.height) - this.config.camera.y, tile.options);
        }
      }

      const ssprite = this.Container.Components["StaticSpriteComponent"][entity];
      if(ssprite) {
        if(this.ShouldDraw(pos.x, pos.y, ssprite.width, ssprite.height)) {
          ssprite.sprite.draw(0, 0, pos.x - this.config.camera.x, pos.y - this.config.camera.y, ssprite.options);
        }
      }

      const sprite = this.Container.Components["SpriteComponent"][entity];
      if(sprite) {
        if(this.ShouldDraw(pos.x, pos.y, sprite.width, sprite.height)) {
          sprite.sprite.animate(sprite.animation, sprite.direction, pos.x - this.config.camera.x, pos.y - this.config.camera.y, {});
        }
      }

      const polygon = this.Container.Components["PolygonComponent"][entity];
      if(polygon) {
        ctx.strokeStyle = '#0f0';
        ctx.beginPath();
        ctx.moveTo(pos.x - this.config.camera.x, pos.y - this.config.camera.y);
        polygon.points.forEach((point) => {
          const x = parseInt(point.x) + parseInt(pos.x) - this.config.camera.x;
          const y = parseInt(point.y) + parseInt(pos.y) - this.config.camera.y;
          ctx.lineTo(x, y);
        });
        ctx.lineTo(pos.x - this.config.camera.x, pos.y - this.config.camera.y);
        ctx.closePath();
        ctx.stroke();
      }

      const polyline = this.Container.Components["PolylineComponent"][entity];
      if(polyline) {
        ctx.strokeStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(pos.x - this.config.camera.x, pos.y - this.config.camera.y);
        polyline.points.forEach((point) => {
          const x = parseInt(point.x) + parseInt(pos.x) - this.config.camera.x;
          const y = parseInt(point.y) + parseInt(pos.y) - this.config.camera.y;
          ctx.lineTo(x, y);
        });
        ctx.lineTo(pos.x - this.config.camera.x, pos.y - this.config.camera.y);
        ctx.closePath();
        ctx.stroke();
      }
    });

//    const time = this.DeltaTimeGet();
//    console.log("Drawing system frame time: " + time + "ms");
  }
}

export default DrawingSystem;
