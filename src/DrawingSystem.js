import { System } from '@metaverse-systems/libecs-js';

class DrawingSystem extends System
{
  constructor(config)
  {
    if(config === undefined) {
      config = {};
    }

    super(config);
    this.Handle = "DrawingSystem";
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

    Object.keys(this.Container.Components["SpriteComponent"]).forEach((entity) => {
      let sprite = this.Container.Components["SpriteComponent"][entity];
      let pos = this.Container.Components["PositionComponent"][entity];


      if(sprite.sprite) {
        sprite.sprite.animate(sprite.animation, sprite.direction, pos.x, pos.y, 2);
      }
    });
  }
}

export default DrawingSystem;
