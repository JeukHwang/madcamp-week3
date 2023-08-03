import React from "react";

const GameBoard = () => {
  const numRows = 7;
  const numCols = 7;

  const renderGrid = () => {
    const grid = [];

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const cellId = `cell-${row}-${col}`;
        grid.push(<div key={cellId} className="grid-cell" id={cellId}></div>);
      }
    }

    return grid;
  };

  return <div className="game-board">{renderGrid()}</div>;
};

export default GameBoard;
