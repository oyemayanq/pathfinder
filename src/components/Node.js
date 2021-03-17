import "../styles/node.css";
import React from "react";

const Node = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  let extraClass = "";
  if (isStart) extraClass = "start-node";
  if (isEnd) extraClass = "end-node";
  if (isWall) extraClass = "wall-node";

  return (
    <div
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      id={`node-${row}-${col}`}
      className={`node ${extraClass}`}
    ></div>
  );
};

export default Node;
