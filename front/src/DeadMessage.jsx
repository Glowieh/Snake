import React from 'react';

function DeadMessage(props) {
  let deadMessage;

  if(props.headPosition.x < props.gridSize.width && props.headPosition.y < props.gridSize.height &&
     props.headPosition.x >= 0 && props.headPosition.y >= 0) {
       deadMessage = "You ate yourself!";
  }
  else {
    deadMessage = "You hit the wall!";
  }

  return (
    <h2 className="alive-status">
      {props.alive ? "" : deadMessage}
    </h2>
  );
}

export default DeadMessage;
