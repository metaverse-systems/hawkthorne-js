import React, { Component } from "react";
import './App.css';
import ReactAudioPlayer from 'react-audio-player';
import { Manager } from "@metaverse-systems/libecs-js";
import { SpriteComponent, StaticSpriteComponent, PositionComponent, TileComponent, TilesheetComponent, PolygonComponent, PolylineComponent } from "./Components";
import DrawingSystem from "./DrawingSystem";
import tmx2json from "./tmx2json";
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

const costume = "base";

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
      playerCostume: "santa"
    };

    this.world = ECS.Container();
    this.world.System(this.state.drawingSystem);
    this.world.Start(250);
  }

  componentDidMount = () => {
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

  initializeMap = () => {
    let t = new tmx2json(baseURL + "/src/maps/" + this.state.map + ".tmx");

    setTimeout(() => {
      let canvas = document.getElementById('board');
      canvas.width = t.width * t.tilewidth;
      canvas.height = t.height * t.tileheight;

      this.state.drawingSystem.ConfigUpdate({ width: canvas.width, height: canvas.height });
      console.log(t);

      if(t.properties.soundtrack !== undefined) {
        let track = t.properties.soundtrack;
        let url = "";
        if(track.search("ogg") !== -1) {
          url = baseURL + "/src/" + track;
        } else {
          url = baseMusicURL + t.properties.soundtrack + ".ogg";
        }
        this.setState({ music: url });
        document.getElementById('rap').play();
      } else {
        document.getElementById('rap').pause();
        this.setState({ music: "" });
      }

      t.layers.forEach((layer) => {
        this.buildLayer(layer, t.tilesets[0]);
      });

      t.objectgroups.forEach((group) => {
        group.objects.forEach((o) => {
          this.buildObject(o);
        });
      });

      console.log(this.world);
    }, 500);
  }

  initializePlayer = () => {
    let canvas = document.getElementById('board');
    let spriteURL = characterImagesBaseURL + this.state.playerCharacter + "/" + this.state.playerCostume + ".png";

    let e = this.world.Entity("player");
    e.Component(new PositionComponent(this.state.levelStart));
    e.Component(new SpriteComponent({ canvas: canvas, url: spriteURL, width: 48, height: 48,
      characterMap: this.state.characterMap, animation: this.state.animation, direction: this.state.direction }));
  }

  initializeCharacters = () => {
    let canvas = document.getElementById('board');
    let x = 50;
    let y = 200;

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

    if(o.polygon !== undefined) {
      this.buildPolygon(o);
      return;
    }

    if(o.polyline !== undefined) {
      this.buildPolyline(o);
      return;
    }
  }

  buildPolygon = (o) => {
    let e = this.world.Entity();
    e.Component(new PositionComponent({ x: o.x, y: o.y }));
    e.Component(new PolygonComponent({ points: o.polygon.points }));
  }

  buildPolyline = (o) => {
    let e = this.world.Entity();
    e.Component(new PositionComponent({ x: o.x, y: o.y }));
    e.Component(new PolylineComponent({ points: o.polyline.points }));
  }

  buildSprite = (o) => {
    let url = baseURL + "/src/" + o.properties.sheet;

    let e = this.world.Entity();
    e.Component(new PositionComponent({ x: o.x, y: o.y }));

    let options = { flipHorizontal: o.properties.flip === "true" ? true : false };
    e.Component(new StaticSpriteComponent({ canvas: document.getElementById('board'), url: url, width: o.properties.width,
                                            height: o.properties.height, x: o.x, y: o.y, options: options }));
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
            {Object.keys(this.state.characterMap).map((a, i) => {
              return <option key={i}>{a}</option>
            })}
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
