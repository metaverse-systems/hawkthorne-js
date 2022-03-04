import { Component } from "react";
import "./App.css";
declare class App extends Component {
    constructor(props: any);
    componentWillUnmount: () => void;
    componentDidMount: () => void;
    handleResize: () => void;
    setMusic: (track: any) => void;
    loadMap: () => void;
    moveCamera: (x: any, y: any) => void;
    centerCamera: () => void;
    setBackgroundColor: (map: any) => void;
    setMusic: (track: any) => void;
    initializePlayer: (pos: any) => void;
    changeAnimation: (e: any) => void;
    changeDirection: (e: any) => void;
    updateSpriteComponent: () => void;
    destroyMap: () => void;
    changeMap: (e: any) => void;
    volume: (e: any) => void;
    keyDown: (e: any) => void;
    render(): JSX.Element;
}
export default App;
