import React, { Component } from 'react';
import keydown from 'react-keydown';
import './App.css';

import Grid from './Grid.jsx';
import GridSizer from './GridSizer.jsx';
import StatusMessage from './StatusMessage.jsx';

import Game from './Game.js';

import { Config } from './Config';

class App extends Component {
  constructor(props) {
    super(props);

    this.game = new Game();

    this.state = {grid: this.game.initGrid(Config.defaultGridSize.width, Config.defaultGridSize.height),
                  gridSize: Config.defaultGridSize,
                  headPosition: {x: 0, y: 0},
                  direction: {x: 0, y: 0},
                  alive: true,
                  points: 0};

    this.handleSetGrid = this.handleSetGrid.bind(this);
  }

  componentDidMount() {
    this.runGame();
  }

  runGame() {
    let newState;
    let tick = 75 - this.state.points;

    if(tick < 1) {
      tick = 1;
    }

    setTimeout(() => {
      newState = this.game.runGameTurn(Object.assign({}, this.state));

      if(newState != null) {
        this.setState(newState, () => this.runGame());
      }
      else {
        this.runGame();
      }
    }, tick);
  }

  @keydown('up', 'down', 'left', 'right')
  getInput(event){
    switch (event.which) {
      case 38: {//up
        this.setState({direction: {x: 0, y: -1}});
        break;
      }
      case 40: {//down
        this.setState({direction: {x: 0, y: 1}});
        break;
      }
      case 37: {//left
        this.setState({direction: {x: -1, y: 0}});
        break;
      }
      case 39: {//right
        this.setState({direction: {x: 1, y: 0}});
        break;
      }
      default: break;
    }
  }

  handleSetGrid(width, height) {
    this.setState({grid: this.game.initGrid(width, height),
                  gridSize: {width, height},
                  alive: true,
                  headPosition: {x: 0, y: 0},
                  direction: {x: 0, y: 0},
                  points: 0});
  }

  render() {
    return (
      <div>
        <h1 className="title">
          <a href="/">Snake!</a>
        </h1>
        <div className="main-container">
          <Grid
            grid={this.state.grid}
            gridSize={this.state.gridSize} />
        </div>
        <StatusMessage
          alive={this.state.alive}
          headPosition={this.state.headPosition}
          gridSize={this.state.gridSize}
          points={this.state.points} />
        <GridSizer
          onSetGrid={this.handleSetGrid} />
      </div>
    );
  }
}

export default App;
