import React, { Component } from "react";
import './App.css';
import SpriteAnimation from './SpriteAnimation';

const charactersBaseURL = "https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master/src/images/characters/";
const characterMapURL = "https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master/src/character_map.json";
const characters = [
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
      characterMap: {}
    };

    this.sprites = [];
  }

  componentDidMount = () => {
    fetch(characterMapURL)
    .then((response) => response.json())
    .then((data) => {
      this.setState({ characterMap: data }, () => {
        this.initialize();
      });
    });
  }

  initialize = () => {
    let canvas = document.getElementById('board');

    characters.forEach((c) => {
      let spriteURL = charactersBaseURL + c + "/" + costume + ".png";
      this.sprites.push(new SpriteAnimation(canvas, spriteURL, 48, 48, this.state.characterMap));
    });

    setInterval(() => {
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let x = 0;
      let y = 50;
      this.sprites.forEach((sprite) => {
        sprite.animate(this.state.animation, this.state.direction, x, y, 2);
        x += 100;
        if(x > 900) {
          x = 0;
          y += 100;
        }
      });
    }, 250);
  }

  changeAnimation = (e) => {
    this.setState({ animation: e.target.value });
  }

  changeDirection = (e) => {
    this.setState({ direction: e.target.value });
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
