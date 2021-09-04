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

class TilesheetComponent extends Component
{
  constructor(config) {
    super(config);
    this.Type = "TilesheetComponent";
  }
}

class TileComponent extends Component
{
  constructor(config) {
    super(config);
    this.tilesheet = config.tilesheet;
    this.width = config.width;
    this.height = config.height;
    this.x = config.x;
    this.y = config.y;
    this.options = config.options;
    this.Type = "TileComponent";
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
  PositionComponent,
  TileComponent,
  TilesheetComponent
};
