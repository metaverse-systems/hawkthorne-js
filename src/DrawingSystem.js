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
    this.Container.Components["RectangleComponent"] = {};
  }

  ConfigUpdate = (config) => {
    Object.keys(config).forEach((key) => {
      this.config[key] = config[key];
    });
    if(config.width) this.config.board.width = this.config.width;
    if(config.height) this.config.board.height = this.config.height;
  }

  ShouldDraw = (x, y, width, height) => {
    let viewport = { left: this.config.camera.x,
                     top: this.config.camera.y,
                     right: (parseInt(this.config.camera.x) + parseInt(this.config.board.width)),
                     bottom: (parseInt(this.config.camera.y) + parseInt(this.config.board.height)) };

    let o = { left: x,
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
    if(this.config.board === undefined) return;
    let ctx = this.config.board.getContext("2d");

    ctx.clearRect(0, 0, this.config.board.width, this.config.board.height);

    if(this.Container.Components["RectangleComponent"] !== undefined) 
    Object.keys(this.Container.Components["RectangleComponent"]).forEach((entity) => {
      let rect = this.Container.Components["RectangleComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];
      ctx.beginPath();
      ctx.fillStyle = rect.color;
      ctx.rect(pos.x - this.config.camera.x, pos.y - this.config.camera.y, rect.width, rect.height);
      ctx.fill();
    });

    if(this.Container.Components["TilesheetComponent"] !== undefined)
    Object.keys(this.Container.Components["TilesheetComponent"]).forEach((entity) => {
      let tilesheet = this.Container.Components["TilesheetComponent"][entity];

      if(this.tilesheets[tilesheet.url] !== undefined) return;
      this.tilesheets[tilesheet.url] = new SpriteSheet(this.config.board, tilesheet.url, 
                                                       tilesheet.width, tilesheet.height); 

      this.Container.Entity(entity).destroy();
    });

    if(this.Container.Components["TileComponent"] !== undefined)
    Object.keys(this.Container.Components["TileComponent"]).forEach((entity) => {
      let tile = this.Container.Components["TileComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];
      let sheet = this.tilesheets[tile.tilesheet];

      if(this.ShouldDraw(pos.x * tile.width, pos.y * tile.height, tile.width, tile.height)) {
        sheet.draw(tile.x, tile.y, (pos.x * tile.width) - this.config.camera.x, (pos.y * tile.height) - this.config.camera.y, tile.options);
      }
    });

    if(this.Container.Components["StaticSpriteComponent"] !== undefined)
    Object.keys(this.Container.Components["StaticSpriteComponent"]).forEach((entity) => {
      let sprite = this.Container.Components["StaticSpriteComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];

      if(this.ShouldDraw(pos.x, pos.y, sprite.width, sprite.height)) {
        sprite.sprite.draw(0, 0, pos.x - this.config.camera.x, pos.y - this.config.camera.y, sprite.options);
      }
    });

    if(this.Container.Components["SpriteComponent"] !== undefined)
    Object.keys(this.Container.Components["SpriteComponent"]).forEach((entity) => {
      let sprite = this.Container.Components["SpriteComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];

      if(this.ShouldDraw(pos.x, pos.y, sprite.width, sprite.height)) {
        sprite.sprite.animate(sprite.animation, sprite.direction, pos.x - this.config.camera.x, pos.y - this.config.camera.y, {});
      }
    });

    if(this.Container.Components["PolygonComponent"] !== undefined)
    Object.keys(this.Container.Components["PolygonComponent"]).forEach((entity) => {
      let poly = this.Container.Components["PolygonComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];

      ctx.strokeStyle = '#0f0';
      ctx.beginPath();
      ctx.moveTo(pos.x - this.config.camera.x, pos.y - this.config.camera.y);
      poly.points.forEach((point) => {
        let x = parseInt(point.x) + parseInt(pos.x) - this.config.camera.x;
        let y = parseInt(point.y) + parseInt(pos.y) - this.config.camera.y;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(pos.x - this.config.camera.x, pos.y - this.config.camera.y);
      ctx.closePath();
      ctx.stroke();
    });

    if(this.Container.Components["PolylineComponent"] !== undefined)
    Object.keys(this.Container.Components["PolylineComponent"]).forEach((entity) => {
      let poly = this.Container.Components["PolylineComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];

      ctx.strokeStyle = '#f00';
      ctx.beginPath();
      ctx.moveTo(pos.x - this.config.camera.x, pos.y - this.config.camera.y);
      poly.points.forEach((point) => {
        let x = parseInt(point.x) + parseInt(pos.x) - this.config.camera.x;
        let y = parseInt(point.y) + parseInt(pos.y) - this.config.camera.y;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(pos.x - this.config.camera.x, pos.y - this.config.camera.y);
      ctx.closePath();
      ctx.stroke();
    });
  }
}

export default DrawingSystem;
