import React, { Component } from 'react';

import { Config } from './Config.jsx';

class GridSizer extends Component {
  constructor(props) {
    super(props);
    this.state = {gridWidth: Config.defaultGridSize.width, gridHeight: Config.defaultGridSize.height};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if(event.target.name === "width") {
      this.setState({gridWidth: parseInt(event.target.value, 10)});
    }
    else {
      this.setState({gridHeight: parseInt(event.target.value, 10)});
    }
  }

  handleSubmit() {
    this.props.onSetGrid(this.state.gridWidth, this.state.gridHeight);
  }

  render() {
    return (
      <div className="grid-sizer">
        <label>Grid Width:</label>
        <input className="grid-sizer-input" type="number" defaultValue={Config.defaultGridSize.width} name="width" onChange={this.handleChange} />
        <label>Grid Height:</label>
        <input className="grid-sizer-input" type="number" defaultValue={Config.defaultGridSize.height} name="height" onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Reset Grid</button>
      </div>
    );
  }
}

export default GridSizer;
