import React, { Component } from "react";
import "./App.css";
import ReactAudioPlayer from "react-audio-player";
import { Manager } from "@metaverse-systems/libecs-js";
import { RectangleComponent, SpriteComponent, StaticSpriteComponent, 
         PositionComponent, TileComponent, TilesheetComponent, 
         PolygonComponent, PolylineComponent } from "./Components";
import DrawingSystem from "./DrawingSystem";
import tmx from "tiled-tmx-parser";
import Maps from "./maps.json";

const ECS = new Manager();

const baseURL = "https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master";
const characterBaseURL = baseURL + "/src/characters/";
const characterImagesBaseURL = baseURL + "/src/images/characters/";
const characterMapURL = baseURL + "/src/character_map.json";
const baseMusicURL = baseURL + "/src/audio/music/";

const characterNames = [
  "abed", "britta", "chang", "duncan", "garrett", "guzman", "leonard", "rich", "troy", "vicedean",
  "annie", "buddy", "dean", "fatneil", "gilbert", "jeff", "pierce", "shirley", "vaughn", "vicki"
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      music: "",
      volume: 0.25,
      map: "studyroom",
      animation: "idle",
      direction: "right",
      characterMap: {},
      characters: {},
      drawingSystem: new DrawingSystem({
        width: window.innerWidth,
        height: window.innerHeight
      }),
      levelStart: { x: 0, y: 0 },
      playerCharacter: "annie",
      playerCostume: "santa",
      camera: { x: 0, y: 0 }
    };

    this.world = ECS.Container();
    this.world.System(this.state.drawingSystem);
    this.world.Start(1000 / 15);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.keyDown);
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.keyDown);

    this.handleResize();
    fetch(characterMapURL)
    .then((response) => response.json())
    .then((data) => {
      this.setState({ characterMap: data }, () => {
        this.initializeMap();
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

  moveCamera = (x, y) => {
    this.setState({ camera: { x: x, y: y } }, () => {
      this.state.drawingSystem.ConfigUpdate({ camera: this.state.camera });
    });
  }

  centerCamera = () => {
    const pos = this.world.Components["PositionComponent"]["player"];
    const width = this.state.drawingSystem.config.width;

    const rightTrigger = this.state.camera.x + (width * .75);
    if(pos.x > rightTrigger) {
      this.moveCamera(this.state.camera.x + 5, this.state.camera.y);
      return;
    }

    const leftTrigger = this.state.camera.x + (width *.25);
    if(pos.x < leftTrigger) {
      let newX = this.state.camera.x - 5;
      if(newX < 0) newX = 0;
      this.moveCamera(newX, this.state.camera.y);
      return;
    }
  }

  setBackgroundColor = (map) => {
    const e = this.world.Entity();
    e.Component(new PositionComponent({ x: 0, y: 0 }));

    const backgroundWidth = map.width * map.tileWidth;
    const backgroundHeight = map.height * map.tileHeight;
    const color = "#" + parseInt(map.properties.red).toString(16)
                      + parseInt(map.properties.green).toString(16)
                      + parseInt(map.properties.blue).toString(16);

    e.Component(new RectangleComponent({ width: backgroundWidth, height: backgroundHeight, color: color }));
  }

  setMusic = (track) => {
    if(track === undefined) {
      track = "level";
    }

    let soundtrackURL = "";
    if(track.search("ogg") !== -1) {
      soundtrackURL = baseURL + "/src/" + track;
    } else {
      soundtrackURL = baseMusicURL + track + ".ogg";
    }

    this.setState({ music: soundtrackURL }, () => {
      document.getElementById('rap').play();
    });
  }

  initializeMap = () => {
    const mapURL = baseURL + "/src/maps/" + this.state.map + ".tmx";
    fetch(mapURL)
    .then((response) => response.text())
    .then((data) => {
      tmx.parse(data, "", (err, map) => {
        if(map.properties.red !== undefined) this.setBackgroundColor(map);
        this.setMusic(map.properties.soundtrack);
        map.layers.forEach((layer) => {
          switch(layer.type)
          {
            case "tile":
              this.buildTileLayer(layer);
              break;
            case "object":
              this.buildObjectLayer(layer);
              break;
            default:
              console.log("initializeMap(): Unknown layer type: " + layer.type);
              break;
          }
        });
      });
    });
  }

  initializePlayer = (pos) => {
    let canvas = document.getElementById('board');
    let spriteURL = characterImagesBaseURL + this.state.playerCharacter + "/" + this.state.playerCostume + ".png";

    let e = this.world.Entity("player");
    if(pos !== undefined) e.Component(new PositionComponent(pos));
    else e.Component(new PositionComponent(this.state.levelStart));
    e.Component(new SpriteComponent({ canvas: canvas, url: spriteURL, width: 48, height: 48,
      characterMap: this.state.characterMap, animation: this.state.animation, direction: this.state.direction }));
  }

  buildObjectLayer = (layer) => {
    layer.objects.forEach((o) => {
      this.buildObject(o);
    });
  }

  buildObject = (o) => {
    if(o.type === "sprite") {
      this.buildSprite(o);
      return;
    }

    if(o.type === "door") {
      if(o.name !== "main") return;
      this.setState({ levelStart: { x: o.x - 0, y: o.y - 0 } }, () => {
        this.initializePlayer();
      });
    }

    if(o.polygon !== null) {
      this.buildPolygon(o);
      return;
    }

    if(o.polyline !== null) {
      this.buildPolyline(o);
      return;
    }
  }

  buildPolygon = (o) => {
    const e = this.world.Entity();
    e.Component(new PositionComponent({ x: o.x, y: o.y }));
    e.Component(new PolygonComponent({ points: o.polygon }));
  }

  buildPolyline = (o) => {
    const e = this.world.Entity();
    e.Component(new PositionComponent({ x: o.x, y: o.y }));
    e.Component(new PolylineComponent({ points: o.polyline }));
  }

  buildSprite = (o) => {
    const url = baseURL + "/src/" + o.properties.sheet;

    const e = this.world.Entity();
    e.Component(new PositionComponent({ x: o.x, y: o.y }));

    const options = { flipHorizontal: o.properties.flip === "true" ? true : false };
    e.Component(new StaticSpriteComponent({ canvas: document.getElementById('board'), url: url, width: o.properties.width,
                                            height: o.properties.height, x: o.x, y: o.y, options: options }));
  }

  buildTileLayer = (layer) => {
    const tileSet = layer.map.tileSets[0];
    const tilesheetURL = baseURL + "/src/images/" + tileSet.image.source;
    const tilesheetCols = tileSet.image.width / tileSet.tileWidth;

    let e = this.world.Entity();
    e.Component(new TilesheetComponent({ url: tilesheetURL, width: tileSet.tileWidth, height: tileSet.tileHeight }));

    let maxCols = layer.map.width;
    let maxRows = layer.map.height;

    let index = 0;
    for(let y = 0; y < maxRows; y++)
    {
      for(let x = 0; x < maxCols; x++)
      {
        if(layer.tiles[index] === undefined) {
          index++;
          continue;
        }

        let tileId = layer.tiles[index].id;

        if(tileId === -1)
        {
            index++;
            continue;
        }

        let tX = tileId % tilesheetCols;
        let tY = (tileId - tX) / tilesheetCols;

        let options = {};
        if(layer.horizontalFlips[index] === true) {
          options.flipHorizontal = true;
        }
        if(layer.verticalFlips[index] === true) {
          options.flipVertical = true;
        }
        if(layer.diagonalFlips[index] === true) {
          options.flipDiagonal = true;
        }
        e = this.world.Entity();
        e.Component(new PositionComponent({ x: x, y: y }));
        e.Component(new TileComponent({ tilesheet: tilesheetURL, width: tileSet.tileWidth, height: tileSet.tileHeight, x: tX, y: tY, options: options }));

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

  destroyMap = () => {
    Object.keys(this.world.Components["TileComponent"]).forEach((entity) => {
      this.world.Entity(entity).destroy();
    });

    Object.keys(this.world.Components["StaticSpriteComponent"]).forEach((entity) => {
      this.world.Entity(entity).destroy();
    });

    Object.keys(this.world.Components["PolygonComponent"]).forEach((entity) => {
      this.world.Entity(entity).destroy();
    });

    if(this.world.Components["PolylineComponent"] !== undefined)
    Object.keys(this.world.Components["PolylineComponent"]).forEach((entity) => {
      this.world.Entity(entity).destroy();
    });

    if(this.world.Components["RectangleComponent"] !== undefined)
    Object.keys(this.world.Components["RectangleComponent"]).forEach((entity) => {
      this.world.Entity(entity).destroy();
    });
  }

  changeMap = (e) => {
    this.destroyMap();
    this.setState({ map: e.target.value }, () => {
      this.initializeMap();
    });
  }

  volume = (e) => {
    this.setState({ volume: e.target.volume });
  }

  keyDown = (e) => {
    let newPos = { x: 0, y: 0 };
    switch(e.key) {
      case 'd':
      case 'D':
        newPos.x = 5;
        this.setState({ direction: "right" });
        break;
      case 'a':
      case 'A':
        newPos.x = -5;
        this.setState({ direction: "left" });
        break;
      default:
        break;
    }

    if(newPos.x || newPos.y) {
      let pos = this.world.Components["PositionComponent"]["player"];
      newPos.x += pos.x;
      newPos.y += pos.y;
      this.initializePlayer(newPos);
      this.centerCamera();
    }
  }

  render() {
    return (
      <div>
        <canvas id="board" width="1280" height="720" />
        <div style={ {float: 'right'} }>
          <label htmlFor="map">Choose map:</label>
          <br />
          <select id="map" defaultValue={this.state.map} onChange={this.changeMap}>
            {Maps.map((m, i) => {
              return <option key={i}>{m}</option>
            })}
          </select>
          <br />
          <br />
          <label htmlFor="animation">Choose animation:</label>
          <br />
          <select id="animation" defaultValue={this.state.animation} onChange={this.changeAnimation}>
            {Object.keys(this.state.characterMap).map((a, i) => <option key={i}>{a}</option>)}
          </select>
          <br />
          <br />
          <label htmlFor="direction">Choose direction:</label>
          <br />
          <select id="direction" defaultValue={this.state.direction} onChange={this.changeDirection}>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
          <br />
          <br />
          <ReactAudioPlayer id="rap"
            src={this.state.music}
            loop={true}
            controls={true}
            onVolumeChanged={this.volume}
            volume={this.state.volume}
          />
        </div>
      </div>
    );
  }
};

export default App;
