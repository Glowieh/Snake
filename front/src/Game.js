import { Config } from './Config';

class Game {
  constructor() {
    this.data = {};
  }

  runGameTurn(data) {
    this.data = data;

    if(!this.data.alive || (this.data.direction.x === 0 && this.data.direction.y === 0)) {
      return null;
    }

    let grid = this.data.grid.slice();
    let x = this.data.headPosition.x;
    let y = this.data.headPosition.y;
    let dead = false;
    let points = this.data.points;

    x += this.data.direction.x;
    y += this.data.direction.y;

    if(this.data.direction.x !== 0) {
      if(y-1 >= 0 && this.data.grid[this.getGridIndex(x, y-1, this.data.gridSize.width)] === Config.snakeTile) {
        dead = true;
      }
      if(y+1 < this.data.gridSize.height && this.data.grid[this.getGridIndex(x, y+1, this.data.gridSize.width)] === Config.snakeTile) {
        dead = true;
      }
    }
    if(this.data.direction.y !== 0) {
      if(x-1 >= 0 && this.data.grid[this.getGridIndex(x-1, y, this.data.gridSize.width)] === Config.snakeTile) {
        dead = true;
      }
      if(x+1 < this.data.gridSize.width && this.data.grid[this.getGridIndex(x+1, y, this.data.gridSize.width)] === Config.snakeTile) {
        dead = true;
      }
    }

    if(dead || x < 0 || y < 0 || x >= this.data.gridSize.width || y >= this.data.gridSize.height ||
      this.data.grid[this.getGridIndex(x, y, this.data.gridSize.width)] === Config.snakeTile) {
      this.sendHighScores();
      this.data.alive = false;
      this.data.headPosition = {x, y};
      return this.data;
    }

    if(this.data.grid[this.getGridIndex(x, y, this.data.gridSize.width)] !== Config.appleTile) {
      grid[this.findTail(x, y, this.getGridIndex(x, y, this.data.gridSize.width))] = Config.emptyTile;
    }
    else {
      grid[this.randomizeNewApple()] = Config.appleTile;
      points++;
    }

    grid[this.getGridIndex(x, y, this.data.gridSize.width)] = Config.snakeTile;

    this.data.grid = grid;
    this.data.headPosition = {x, y};
    this.data.points = points;

    return this.data;
  }

  findTail(x, y, prevPos) {
    if(x-1 >= 0 && prevPos !== this.getGridIndex(x-1, y, this.data.gridSize.width) &&
      this.data.grid[this.getGridIndex(x-1, y, this.data.gridSize.width)] === Config.snakeTile) {
      return this.findTail(x-1, y, this.getGridIndex(x, y, this.data.gridSize.width));
    }
    if(x+1 < this.data.gridSize.width && prevPos !== this.getGridIndex(x+1, y, this.data.gridSize.width) &&
      this.data.grid[this.getGridIndex(x+1, y, this.data.gridSize.width)] === Config.snakeTile) {
      return this.findTail(x+1, y, this.getGridIndex(x, y, this.data.gridSize.width));
    }
    if(y-1 >= 0 && prevPos !== this.getGridIndex(x, y-1, this.data.gridSize.width) &&
      this.data.grid[this.getGridIndex(x, y-1, this.data.gridSize.width)] === Config.snakeTile) {
      return this.findTail(x, y-1, this.getGridIndex(x, y, this.data.gridSize.width));
    }
    if(y+1 < this.data.gridSize.height && prevPos !== this.getGridIndex(x, y+1, this.data.gridSize.width) &&
      this.data.grid[this.getGridIndex(x, y+1, this.data.gridSize.width)] === Config.snakeTile) {
      return this.findTail(x, y+1, this.getGridIndex(x, y, this.data.gridSize.width));
    }

    return this.getGridIndex(x, y, this.data.gridSize.width);
  }

  randomizeNewApple() {
    let position = Math.floor(Math.random() * this.data.gridSize.width * this.data.gridSize.height - 1);

    while(this.data.grid[position] !== Config.emptyTile) {
      position = Math.floor(Math.random() * this.data.gridSize.width * this.data.gridSize.height - 1);
    }

    return position;
  }

  getGridIndex(x, y, width) {
    return width * parseInt(y, 10) + parseInt(x, 10);
  }

  initGrid(width, height) {
    let grid = new Array(width*height);

    grid.fill(Config.emptyTile);
    grid[0] = Config.snakeTile;
    grid[this.getGridIndex((width-1)/2, (height-1)/2, width)] = Config.appleTile;

    return grid;
  }

  sendHighScores() {
    fetch('/Game/AddHighScore', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        points: this.data.points,
        gridWidth: this.data.gridSize.width,
        gridHeight: this.data.gridSize.height
      })
    })
    .then(res => {
      console.log("Fetch done: ", res);
    })
    .catch(err => {
      console.log("Couldn't add high scores: ", err);
    });
  }
}

export default Game;
