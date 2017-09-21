import React from 'react';

import { Config } from './Config.jsx';

function GridCell(props) {
  let addedClass = "grid-cell";

  switch (props.tile) {
    case Config.snakeTile: {
      addedClass += " snake-tile";
      break;
    }
    case Config.appleTile: {
      addedClass += " apple-tile";
      break;
    }
    case Config.emptyTile: {
      addedClass += " empty-tile";
      break;
    }
    default: break;
  }

  return (
    <div className={addedClass}>
    </div>
  );
}

export default GridCell;
