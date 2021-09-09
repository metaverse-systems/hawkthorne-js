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
      ctx.rect(pos.x, pos.y, rect.width, rect.height);
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

      sheet.draw(tile.x, tile.y, pos.x * tile.width, pos.y * tile.height, tile.options);
    });

    if(this.Container.Components["StaticSpriteComponent"] !== undefined)
    Object.keys(this.Container.Components["StaticSpriteComponent"]).forEach((entity) => {
      let sprite = this.Container.Components["StaticSpriteComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];

      if(sprite.sprite) {
        sprite.sprite.draw(0, 0, pos.x, pos.y, sprite.options);
      }
    });

    if(this.Container.Components["SpriteComponent"] !== undefined)
    Object.keys(this.Container.Components["SpriteComponent"]).forEach((entity) => {
      let sprite = this.Container.Components["SpriteComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];

      if(sprite.sprite) {
        sprite.sprite.animate(sprite.animation, sprite.direction, pos.x, pos.y, {});
      }
    });

    if(this.Container.Components["PolygonComponent"] !== undefined)
    Object.keys(this.Container.Components["PolygonComponent"]).forEach((entity) => {
      let poly = this.Container.Components["PolygonComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];

      ctx.strokeStyle = '#0f0';
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      poly.points.forEach((point) => {
        let x = parseInt(point.x) + parseInt(pos.x);
        let y = parseInt(point.y) + parseInt(pos.y);
        ctx.lineTo(x, y);
      });
      ctx.lineTo(pos.x, pos.y);
      ctx.closePath();
      ctx.stroke();
    });

    if(this.Container.Components["PolylineComponent"] !== undefined)
    Object.keys(this.Container.Components["PolylineComponent"]).forEach((entity) => {
      let poly = this.Container.Components["PolylineComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];

      ctx.strokeStyle = '#f00';
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      poly.points.forEach((point) => {
        let x = parseInt(point.x) + parseInt(pos.x);
        let y = parseInt(point.y) + parseInt(pos.y);
        ctx.lineTo(x, y);
      });
      ctx.lineTo(pos.x, pos.y);
      ctx.closePath();
      ctx.stroke();
    });
  }
}

export default DrawingSystem;
