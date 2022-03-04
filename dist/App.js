"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("./App.css");
const react_audio_player_1 = __importDefault(require("react-audio-player"));
const libecs_js_1 = require("@metaverse-systems/libecs-js");
const tmx_map_loading_system_1 = require("@metaverse-systems/tmx-map-loading-system");
const DrawingSystem_1 = __importDefault(require("./DrawingSystem"));
const tmx_map_loading_system_2 = __importDefault(require("@metaverse-systems/tmx-map-loading-system"));
const maps_json_1 = __importDefault(require("./maps.json"));
const ECS = new libecs_js_1.Manager();
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
class App extends react_1.Component {
    constructor(props) {
        super(props);
        this.componentWillUnmount = () => {
            document.removeEventListener('keydown', this.keyDown);
        };
        this.componentDidMount = () => {
            document.addEventListener('keydown', this.keyDown);
            this.handleResize();
            this.loadMap();
        };
        this.handleResize = () => {
            //    const width = window.innerWidth;
            //    const height = window.innerHeight;
            const width = 1600;
            const height = 1600;
            if (this.state.drawingSystem !== null) {
                this.state.drawingSystem.ConfigUpdate({ height: height, width: width, board: document.getElementById('board') });
            }
        };
        this.setMusic = (track) => {
            if (track === undefined) {
                track = "level";
            }
            let soundtrackURL = "";
            if (track.search("ogg") !== -1) {
                soundtrackURL = baseURL + "/src/" + track;
            }
            else {
                soundtrackURL = baseMusicURL + track + ".ogg";
            }
            this.setState({ music: soundtrackURL }, () => {
                document.getElementById('rap').play();
            });
        };
        this.loadMap = () => {
            const mapURL = baseURL + "/src/maps/" + this.state.map + ".tmx";
            let e;
            const CurrentScenes = this.world.Components["CurrentSceneComponent"];
            if (CurrentScenes !== undefined) {
                Object.keys(CurrentScenes).forEach((entity) => {
                    e = this.world.Entity(entity);
                });
            }
            if (!e)
                e = this.world.Entity();
            e.Component(new tmx_map_loading_system_1.CurrentSceneComponent({ scene: this.state.map }));
            e = this.world.Entity();
            e.Component(new tmx_map_loading_system_1.LoadSceneComponent({ scene: this.state.map, url: mapURL }));
        };
        this.moveCamera = (x, y) => {
            this.setState({ camera: { x: x, y: y } }, () => {
                this.state.drawingSystem.ConfigUpdate({ camera: this.state.camera });
            });
        };
        this.centerCamera = () => {
            const pos = this.world.Components["PositionComponent"]["player"];
            const width = this.state.drawingSystem.config.width;
            const rightTrigger = this.state.camera.x + (width * .75);
            if (pos.x > rightTrigger) {
                this.moveCamera(this.state.camera.x + 5, this.state.camera.y);
                return;
            }
            const leftTrigger = this.state.camera.x + (width * .25);
            if (pos.x < leftTrigger) {
                let newX = this.state.camera.x - 5;
                if (newX < 0)
                    newX = 0;
                this.moveCamera(newX, this.state.camera.y);
                return;
            }
        };
        this.setBackgroundColor = (map) => {
            const e = this.world.Entity();
            e.Component(new tmx_map_loading_system_1.PositionComponent({ x: 0, y: 0 }));
            const backgroundWidth = map.width * map.tileWidth;
            const backgroundHeight = map.height * map.tileHeight;
            const color = "#" + parseInt(map.properties.red).toString(16)
                + parseInt(map.properties.green).toString(16)
                + parseInt(map.properties.blue).toString(16);
            e.Component(new tmx_map_loading_system_1.RectangleComponent({ width: backgroundWidth, height: backgroundHeight, color: color }));
        };
        this.setMusic = (track) => {
            if (track === undefined) {
                track = "level";
            }
            let soundtrackURL = "";
            if (track.search("ogg") !== -1) {
                soundtrackURL = baseURL + "/src/" + track;
            }
            else {
                soundtrackURL = baseMusicURL + track + ".ogg";
            }
            this.setState({ music: soundtrackURL }, () => {
                document.getElementById('rap').play();
            });
        };
        this.initializePlayer = (pos) => {
            let canvas = document.getElementById('board');
            let spriteURL = characterImagesBaseURL + this.state.playerCharacter + "/" + this.state.playerCostume + ".png";
            let e = this.world.Entity("player");
            if (pos !== undefined)
                e.Component(new tmx_map_loading_system_1.PositionComponent(pos));
            else
                e.Component(new tmx_map_loading_system_1.PositionComponent(this.state.levelStart));
            e.Component(new tmx_map_loading_system_1.SpriteComponent({ canvas: canvas, url: spriteURL, width: 48, height: 48,
                characterMap: this.state.characterMap, animation: this.state.animation, direction: this.state.direction }));
        };
        this.changeAnimation = (e) => {
            this.setState({ animation: e.target.value }, () => {
                this.updateSpriteComponent();
            });
        };
        this.changeDirection = (e) => {
            this.setState({ direction: e.target.value }, () => {
                this.updateSpriteComponent();
            });
        };
        this.updateSpriteComponent = () => {
            Object.keys(this.world.Components["SpriteComponent"]).forEach((entity) => {
                this.world.Components["SpriteComponent"][entity].animation = this.state.animation;
                this.world.Components["SpriteComponent"][entity].direction = this.state.direction;
            });
        };
        this.destroyMap = () => {
            Object.keys(this.world.Components["TileComponent"]).forEach((entity) => {
                this.world.Entity(entity).destroy();
            });
            Object.keys(this.world.Components["StaticSpriteComponent"]).forEach((entity) => {
                this.world.Entity(entity).destroy();
            });
            Object.keys(this.world.Components["PolygonComponent"]).forEach((entity) => {
                this.world.Entity(entity).destroy();
            });
            if (this.world.Components["PolylineComponent"] !== undefined)
                Object.keys(this.world.Components["PolylineComponent"]).forEach((entity) => {
                    this.world.Entity(entity).destroy();
                });
            if (this.world.Components["RectangleComponent"] !== undefined)
                Object.keys(this.world.Components["RectangleComponent"]).forEach((entity) => {
                    this.world.Entity(entity).destroy();
                });
        };
        this.changeMap = (e) => {
            //    this.destroyMap();
            this.setState({ map: e.target.value }, () => {
                this.loadMap();
            });
        };
        this.volume = (e) => {
            this.setState({ volume: e.target.volume });
        };
        this.keyDown = (e) => {
            let newPos = { x: 0, y: 0 };
            switch (e.key) {
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
            if (newPos.x || newPos.y) {
                let pos = this.world.Components["PositionComponent"]["player"];
                newPos.x += pos.x;
                newPos.y += pos.y;
                this.initializePlayer(newPos);
                this.centerCamera();
            }
        };
        this.state = {
            music: "",
            volume: 0.25,
            map: "test-1",
            animation: "idle",
            direction: "right",
            characterMap: {},
            characters: {},
            drawingSystem: new DrawingSystem_1.default({
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
            this.world.System(new tmx_map_loading_system_2.default({ canvas: document.getElementById('board'), tilesheetBaseURL: baseURL + "/src/" }));
        }, 500);
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("canvas", { id: "board", width: "1600", height: "1600" }),
            react_1.default.createElement("div", { style: { float: 'right' } },
                react_1.default.createElement("label", { htmlFor: "map" }, "Choose map:"),
                react_1.default.createElement("br", null),
                react_1.default.createElement("select", { id: "map", defaultValue: this.state.map, onChange: this.changeMap }, maps_json_1.default.map((m, i) => {
                    return react_1.default.createElement("option", { key: i }, m);
                })),
                react_1.default.createElement("br", null),
                react_1.default.createElement("br", null),
                react_1.default.createElement("label", { htmlFor: "animation" }, "Choose animation:"),
                react_1.default.createElement("br", null),
                react_1.default.createElement("select", { id: "animation", defaultValue: this.state.animation, onChange: this.changeAnimation }, Object.keys(this.state.characterMap).map((a, i) => react_1.default.createElement("option", { key: i }, a))),
                react_1.default.createElement("br", null),
                react_1.default.createElement("br", null),
                react_1.default.createElement("label", { htmlFor: "direction" }, "Choose direction:"),
                react_1.default.createElement("br", null),
                react_1.default.createElement("select", { id: "direction", defaultValue: this.state.direction, onChange: this.changeDirection },
                    react_1.default.createElement("option", { value: "left" }, "Left"),
                    react_1.default.createElement("option", { value: "right" }, "Right")),
                react_1.default.createElement("br", null),
                react_1.default.createElement("br", null),
                react_1.default.createElement(react_audio_player_1.default, { id: "rap", src: this.state.music, loop: true, controls: true, onVolumeChanged: this.volume, volume: this.state.volume }))));
    }
}
;
exports.default = App;
//# sourceMappingURL=App.js.map