import React, { Component } from "react";
import './App.css';
import { Manager } from "@metaverse-systems/libecs-js";
import { SpriteComponent, PositionComponent } from "./Components";
import DrawingSystem from "./DrawingSystem";

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
      animation: "walk",
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
        this.initialize();
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

  initialize = () => {
    let canvas = document.getElementById('board');

    let x = 0;
    let y = 50;
    characterNames.forEach((c) => {
      let spriteURL = characterImagesBaseURL + c + "/" + costume + ".png";
      let e = this.world.Entity();
      e.Component(new PositionComponent({ x: x, y: y }));
      e.Component(new SpriteComponent({ canvas: canvas, url: spriteURL, width: 48, height: 48, 
        characterMap: this.state.characterMap, animation: this.state.animation, direction: this.state.direction }));

      x += 100;
      if(x > 900) {
        x = 0;
        y += 100;
      }
    });

    console.log(this.world.Export());
    this.world.Start(250);
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

  render() {
    return (
      <div className="App">
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
