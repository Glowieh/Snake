import React from 'react';

function StatusMessage(props) {
  let deadMessage;
  let pointsMessage = "Points: " + props.points;

  if(props.headPosition.x < props.gridSize.width && props.headPosition.y < props.gridSize.height &&
     props.headPosition.x >= 0 && props.headPosition.y >= 0) {
       deadMessage = "You ate yourself!";
  }
  else {
    deadMessage = "You hit the wall!";
  }

  return (
    <h4 className="alive-status">
      {props.alive ? pointsMessage : pointsMessage + " - " + deadMessage}
    </h4>
  );
}

export default StatusMessage;
