import { Component } from "@metaverse-systems/libecs-js";
import SpriteAnimation from "./SpriteAnimation";
import SpriteSheet from "./SpriteSheet";

class SpriteComponent extends Component
{
  constructor(config) {
    super(config);
    this.sprite = new SpriteAnimation(config.canvas, config.url, config.width, config.height, config.characterMap);
    this.Type = "SpriteComponent";
  }
}

class StaticSpriteComponent extends Component
{
  constructor(config) {
    super(config);
    this.sprite = new SpriteSheet(config.canvas, config.url, config.width, config.height);
    this.Type = "StaticSpriteComponent";
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
  StaticSpriteComponent,
  PositionComponent,
  TileComponent,
  TilesheetComponent
};
