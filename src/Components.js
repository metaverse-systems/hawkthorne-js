import { Component } from "@metaverse-systems/libecs-js";
import SpriteAnimation from "./SpriteAnimation";

class SpriteComponent extends Component
{
  constructor(config) {
    super(config);
    this.sprite = new SpriteAnimation(config.canvas, config.url, config.width, config.height, config.characterMap);
    this.Type = "SpriteComponent";
  }
}

class PositionComponent extends Component
{
  constructor(config) {
    super(config);
    this.x = config.x;
    this.y = config.y;
    this.Type = "PositionComponent";
  }
}

export {
  SpriteComponent,
  PositionComponent
};
