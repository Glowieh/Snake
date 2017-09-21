import React, { Component } from 'react';
import keydown from 'react-keydown';
import './App.css';

import Grid from './Grid.jsx';
import GridSizer from './GridSizer.jsx';
import DeadMessage from './DeadMessage.jsx';

import { Config } from './Config';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {grid: this.initGrid(Config.defaultGridSize.width, Config.defaultGridSize.height),
                  gridSize: Config.defaultGridSize,
                  headPosition: {x: 0, y: 0},
                  direction: {x: 0, y: 0},
                  alive: true};

    this.handleSetGrid = this.handleSetGrid.bind(this);
  }

  componentDidMount() {
    this.runGame();
  }

  initGrid(width, height) {
    let grid = new Array(width*height);

    grid.fill(Config.emptyTile);
    grid[0] = Config.snakeTile;
    grid[this.getGridIndex((width-1)/2, (height-1)/2, width)] = Config.appleTile;

    return grid;
  }

  getGridIndex(x, y, width) {
    return width * parseInt(y, 10) + parseInt(x, 10);
  }

  handleSetGrid(width, height) {
    this.setState({grid: this.initGrid(width, height), gridSize: {width, height}, alive: true, headPosition: {x: 0, y: 0}, direction: {x: 0, y: 0}});
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

  runGame() {
    setTimeout(() => {
      this.runGameTurn();
      this.runGame();
    }, 100);
  }

  runGameTurn() {
    if(!this.state.alive || (this.state.direction.x === 0 && this.state.direction.y === 0)) {
      return;
    }

    let grid = this.state.grid.slice();
    let x = this.state.headPosition.x;
    let y = this.state.headPosition.y;
    let dead = false;

    x += this.state.direction.x;
    y += this.state.direction.y;

    if(this.state.direction.x !== 0) {
      if(y-1 >= 0 && this.state.grid[this.getGridIndex(x, y-1, this.state.gridSize.width)] === Config.snakeTile) {
        dead = true;
      }
      if(y+1 < this.state.gridSize.height && this.state.grid[this.getGridIndex(x, y+1, this.state.gridSize.width)] === Config.snakeTile) {
        dead = true;
      }
    }
    if(this.state.direction.y !== 0) {
      if(x-1 >= 0 && this.state.grid[this.getGridIndex(x-1, y, this.state.gridSize.width)] === Config.snakeTile) {
        dead = true;
      }
      if(x+1 < this.state.gridSize.width && this.state.grid[this.getGridIndex(x+1, y, this.state.gridSize.width)] === Config.snakeTile) {
        dead = true;
      }
    }

    if(dead || x < 0 || y < 0 || x >= this.state.gridSize.width || y >= this.state.gridSize.height ||
      this.state.grid[this.getGridIndex(x, y, this.state.gridSize.width)] === Config.snakeTile) {
      this.setState({alive: false, headPosition: {x, y}});
      return;
    }

    if(this.state.grid[this.getGridIndex(x, y, this.state.gridSize.width)] !== Config.appleTile) {
      grid[this.findTail(x, y, this.getGridIndex(x, y, this.state.gridSize.width))] = Config.emptyTile;
    }
    else {
      grid[this.randomizeNewApple()] = Config.appleTile;
    }

    grid[this.getGridIndex(x, y, this.state.gridSize.width)] = Config.snakeTile;

    this.setState({grid: grid, headPosition: {x, y}});
  }

  findTail(x, y, prevPos) {
    if(x-1 >= 0 && prevPos !== this.getGridIndex(x-1, y, this.state.gridSize.width) &&
      this.state.grid[this.getGridIndex(x-1, y, this.state.gridSize.width)] === Config.snakeTile) {
      return this.findTail(x-1, y, this.getGridIndex(x, y, this.state.gridSize.width));
    }
    if(x+1 < this.state.gridSize.width && prevPos !== this.getGridIndex(x+1, y, this.state.gridSize.width) &&
      this.state.grid[this.getGridIndex(x+1, y, this.state.gridSize.width)] === Config.snakeTile) {
      return this.findTail(x+1, y, this.getGridIndex(x, y, this.state.gridSize.width));
    }
    if(y-1 >= 0 && prevPos !== this.getGridIndex(x, y-1, this.state.gridSize.width) &&
      this.state.grid[this.getGridIndex(x, y-1, this.state.gridSize.width)] === Config.snakeTile) {
      return this.findTail(x, y-1, this.getGridIndex(x, y, this.state.gridSize.width));
    }
    if(y+1 < this.state.gridSize.height && prevPos !== this.getGridIndex(x, y+1, this.state.gridSize.width) &&
      this.state.grid[this.getGridIndex(x, y+1, this.state.gridSize.width)] === Config.snakeTile) {
      return this.findTail(x, y+1, this.getGridIndex(x, y, this.state.gridSize.width));
    }

    return this.getGridIndex(x, y, this.state.gridSize.width);
  }

  randomizeNewApple() {
    let position = Math.floor(Math.random() * this.state.gridSize.width * this.state.gridSize.height - 1);

    while(this.state.grid[position] !== Config.emptyTile) {
      position = Math.floor(Math.random() * this.state.gridSize.width * this.state.gridSize.height - 1);
    }

    return position;
  }

  render() {
    return (
      <div>
        <h1 className="title">Snake!</h1>
        <DeadMessage
          alive={this.state.alive}
          headPosition={this.state.headPosition}
          gridSize={this.state.gridSize} />
        <div className="main-container">
          <Grid
            grid={this.state.grid}
            gridSize={this.state.gridSize} />
        </div>
        <GridSizer
          onSetGrid={this.handleSetGrid} />
      </div>
    );
  }
}

export default App;
