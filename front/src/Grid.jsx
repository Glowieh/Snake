import React, { Component } from 'react';

import GridCell from './GridCell.jsx';

class Grid extends Component {
  renderGrid() {
    let rows = new Array(this.props.gridSize.height);
    rows.fill(0);
    return (
      rows.map((elem, row) =>
        <div className="grid-row" key={row}>
          {this.renderGridRow(row)}
        </div>
      )
    );
  }

  renderGridRow(row) {
    return (
      this.props.grid.slice(row*this.props.gridSize.width, (row+1)*this.props.gridSize.width).map((cell, index) =>
        <GridCell
          key={index.toString()}
          tile={cell} />
      )
    );
  }

  render() {
    return (
      <div className="grid">
        {this.renderGrid()}
      </div>
    );
  }
}

export default Grid;
