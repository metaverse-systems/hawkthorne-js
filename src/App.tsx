import React, { Component } from "react";
import "./App.css";
import ReactAudioPlayer from "react-audio-player";
import { Manager } from "@metaverse-systems/libecs-js";
import { RectangleComponent, SpriteComponent, 
         PositionComponent, CurrentSceneComponent,
         LoadSceneComponent } from "@metaverse-systems/tmx-map-loading-system";
import DrawingSystem from "./DrawingSystem";
import TMX_MapLoadingSystem from "@metaverse-systems/tmx-map-loading-system";
import Maps from "./maps.json";

const ECS = new Manager();

//const baseURL = "https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master";
const baseURL = "http://localhost";
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
      map: "test-1",
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
    setTimeout(() => {
        this.world.System(new TMX_MapLoadingSystem({ canvas: document.getElementById('board'), tilesheetBaseURL:  baseURL + "/src/" }));
    }, 500);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.keyDown);
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.keyDown);

    this.handleResize();
    this.loadMap();
  }

  handleResize = () => {
//    const width = window.innerWidth;
//    const height = window.innerHeight;
    const width = 1600;
    const height = 1600;

    if(this.state.drawingSystem !== null) {
      this.state.drawingSystem.ConfigUpdate({ height: height, width: width, board: document.getElementById('board') });
    }
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

  loadMap = () => {
    const mapURL = baseURL + "/src/maps/" + this.state.map + ".tmx";
    let e;

    const CurrentScenes = this.world.Components["CurrentSceneComponent"];
    if(CurrentScenes !== undefined) {
      Object.keys(CurrentScenes).forEach((entity) => {
        e = this.world.Entity(entity);
      });
    }

    if(!e) e = this.world.Entity();
    e.Component(new CurrentSceneComponent({ scene: this.state.map }));

    e = this.world.Entity();
    e.Component(new LoadSceneComponent({ scene: this.state.map, url: mapURL }));
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

  initializePlayer = (pos) => {
    let canvas = document.getElementById('board');
    let spriteURL = characterImagesBaseURL + this.state.playerCharacter + "/" + this.state.playerCostume + ".png";

    let e = this.world.Entity("player");
    if(pos !== undefined) e.Component(new PositionComponent(pos));
    else e.Component(new PositionComponent(this.state.levelStart));
    e.Component(new SpriteComponent({ canvas: canvas, url: spriteURL, width: 48, height: 48,
      characterMap: this.state.characterMap, animation: this.state.animation, direction: this.state.direction }));
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
//    this.destroyMap();
    this.setState({ map: e.target.value }, () => {
      this.loadMap();
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
        <canvas id="board" width="1600" height="1600" />
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
