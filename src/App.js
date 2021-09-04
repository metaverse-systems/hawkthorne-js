import React, { Component } from "react";
import './App.css';
import { Manager } from "@metaverse-systems/libecs-js";
import { SpriteComponent, PositionComponent, TileComponent, TilesheetComponent } from "./Components";
import DrawingSystem from "./DrawingSystem";
import tmx2json from "./tmx2json";
import Maps from "./maps.json";

const ECS = new Manager();

const baseURL = "https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master";
const characterBaseURL = baseURL + "/src/characters/";
const characterImagesBaseURL = baseURL + "/src/images/characters/";
const characterMapURL = baseURL + "/src/character_map.json";
const characterNames = [
  "abed", "britta", "chang", "duncan", "garrett", "guzman", "leonard", "rich",     "troy", "vicedean",
  "annie", "buddy", "dean", "fatneil", "gilbert", "jeff", "pierce", "shirley", "vaughn", "vicki"
];

const costume = "base";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: "studyroom",
      animation: "dance",
      direction: "right",
      characterMap: {},
      characters: {},
      drawingSystem: new DrawingSystem({
        width: window.innerWidth,
        height: window.innerHeight
      })
    };

    this.world = ECS.Container();
    this.world.System(this.state.drawingSystem);
  }

  componentDidMount = () => {
    this.handleResize();
    fetch(characterMapURL)
    .then((response) => response.json())
    .then((data) => {
      this.setState({ characterMap: data }, () => {
        this.initializeMap();
        this.initializeCharacters();
      });
    });

    characterNames.forEach((name) => {
      let cURL = characterBaseURL + name + ".json";
      fetch(cURL)
      .then((response) => response.json())
      .then((data) => {
        let characters = Object.assign({}, this.state.characters);
        characters[name] = data;
        this.setState({ characters: characters });
      });
    });
  }

  handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if(this.state.drawingSystem !== null) {
      this.state.drawingSystem.ConfigUpdate({ height: height, width: width, board: document.getElementById('board') });
    }
  }

  initializeMap = () => {
    let t = new tmx2json(baseURL + "/src/maps/" + this.state.map + ".tmx");

    setTimeout(() => {
      t.layers.forEach((layer) => {
        this.buildLayer(layer, t.tilesets[0]);
      });

    }, 500);
  }

  initializeCharacters = () => {
    let canvas = document.getElementById('board');
    let x = 0;
    let y = 400;

    characterNames.forEach((c) => {
      let spriteURL = characterImagesBaseURL + c + "/" + costume + ".png";
      let e = this.world.Entity();
      e.Component(new PositionComponent({ x: x, y: y }));
      e.Component(new SpriteComponent({ canvas: canvas, url: spriteURL, width: 48, height: 48, 
        characterMap: this.state.characterMap, animation: this.state.animation, direction: this.state.direction }));

      x += 50;
      if(x > 450) {
        x = 0;
        y += 50;
      }
    });

    console.log(this.world.Export());
    this.world.Start(250);
  }

  buildLayer = (layer, tileset) => {
    let tilesheet = baseURL + "/src/images/" + tileset.image.source;
    let tileWidth = tileset.tilewidth;
    let tileHeight = tileset.tileheight;
    let tilesheetCols = tileset.image.width / tileWidth;

    let e = this.world.Entity();
    e.Component(new TilesheetComponent({ url: tilesheet, width: tileWidth, height: tileHeight }));

    let maxCols = layer.width;
    let maxRows = layer.height;

    let index = 0;
    for(let y = 0; y < maxRows; y++)
    {
      for(let x = 0; x < maxCols; x++)
      {
        let tileId = layer.tiles[index].id;
        if(tileId === -1)
        {
            index++;
            continue;
        }

        let tX = tileId % tilesheetCols;
        let tY = (tileId - tX) / tilesheetCols;

        let options = {};
        if(layer.tiles[index].flipHorizontal === true) {
          options.flipHorizontal = true;
        }
        if(layer.tiles[index].flipVertical === true) {
          options.flipVertical = true;
        }
        if(layer.tiles[index].flipDiagonal === true) {
          options.flipDiagonal = true;
        }
        e = this.world.Entity();
        e.Component(new PositionComponent({ x: x, y: y }));
        e.Component(new TileComponent({ tilesheet: tilesheet, width: tileWidth, height: tileHeight, x: tX, y: tY, options: options }));

        index++;
      }
    }
  }

  changeAnimation = (e) => {
    this.setState({ animation: e.target.value }, () => {
      this.updateSpriteComponent();
    });
  }

  changeDirection = (e) => {
    this.setState({ direction: e.target.value }, () => {
      this.updateSpriteComponent();
    });
  }

  updateSpriteComponent = () => {
    Object.keys(this.world.Components["SpriteComponent"]).forEach((entity) => {
      this.world.Components["SpriteComponent"][entity].animation = this.state.animation;
      this.world.Components["SpriteComponent"][entity].direction = this.state.direction;
    });
  }

  destroyTiles = () => {
    Object.keys(this.world.Components["TileComponent"]).forEach((entity) => {
      this.world.Entity(entity).destroy();
    });
    console.log(this.world.Export());
  }

  changeMap = (e) => {
    this.destroyTiles();
    this.setState({ map: e.target.value }, () => {
      this.initializeMap();
    });
  }

  render() {
    return (
      <div className="App">
        <select defaultValue={this.state.map} onChange={this.changeMap}>
          {Maps.map((m, i) => {
            return <option key={i}>{m}</option>
          })}
        </select>
        <select defaultValue={this.state.animation} onChange={this.changeAnimation}>
          {Object.keys(this.state.characterMap).map((a, i) => {
            return <option key={i}>{a}</option>
          })}
        </select>
        <select defaultValue={this.state.direction} onChange={this.changeDirection}>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
        <canvas id="board" width="1280" height="720" />
      </div>
    );
  }
};

export default App;
