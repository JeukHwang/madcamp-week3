import Area from "../../atoms/containers/area/Area";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import colorSet from "../../styles/colorSet";
import Background from "../../atoms/containers/background/background";
import React, { useState } from "react";
import { useEffect } from "react";
import Button from "../../atoms/button/button";
import Icon from "../../assets/icon/Icon";
import Java from "../../assets/icon/java.svg";
import JavaScript from "../../assets/icon/javascript.svg";
import Python from "../../assets/icon/python.svg";
import TypeScript from "../../assets/icon/typescript.svg";
import Dart from "../../assets/icon/dart.svg";
import Check from '../../assets/icon/programming.png';
import "../../assets/effect/bouncingAnimation.css";
const width=7;
const iconimage = [
  Java
  ,JavaScript
  ,Python
  ,TypeScript
  , Dart
]
const Main = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const createBoard = () => {
  const randomcolorarrangement = []
  for (let i = 0; i < width*width; i++) {
    const randomColor = iconimage[Math.floor(Math.random()*iconimage.length)]
    randomcolorarrangement.push(randomColor)
  }
  setCurrentColorArrangement(randomcolorarrangement)
}

const handleCellClick = (row: number, col: number) => {
  if (selectedCells.length === 3 && !isCellSelected(row, col)) {
    // Show warning popup when maximum selection limit is reached
    alert("You can only select up to 3 cells.");
    return;
  }

  if (selectedCells.length > 0) {
    const [prevRow, prevCol] = selectedCells[selectedCells.length - 1];
    if (
      Math.abs(prevRow - row) > 1 ||
      Math.abs(prevCol - col) > 1 ||
      (Math.abs(prevRow - row) === 1 && Math.abs(prevCol - col) === 1)
    ) {
      // Show alert when the selected cell is not adjacent to the previous cell
      alert("⚠ You can only select adjacent cells.");
      return;
    }
  }

  const cellIndex = selectedCells.findIndex(([r, c]) => r === row && c === col);

  if (cellIndex !== -1) {
    // Clicked on an already selected cell, so deselect it
    const updatedSelectedCells: [number, number][] = selectedCells.filter(([r, c]) => !(r === row && c === col));
    setSelectedCells(updatedSelectedCells);
  } else {
    // Clicked on a new cell, add it to selected cells
    const updatedSelectedCells: [number, number][] = [...selectedCells, [row, col]];
    setSelectedCells(updatedSelectedCells);

    // Add the "bounce" class to the clicked cell
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      cell.classList.add("bounce");

      // Remove the "bounce" class after the animation completes
      setTimeout(() => {
        cell.classList.remove("bounce");
      }, 500);
    }
  }
};



const isCellSelected = (row: number, col: number) => {
  return selectedCells.some(([r, c]) => r === row && c === col);
};
useEffect(() => {
createBoard()
}, [width])


//console.log(currentColorArrangement)
  return (
            
      <Area>
      <Background color={colorSet.white}>
        <div className="app">
          <div className="game">
            {currentColorArrangement.map((iconPath, index)=>(
                <img
                key={index}
                id={`cell-${Math.floor(index / width)}-${index % width}`} // Unique ID for each cell
                src={iconPath}
                style={{
                  backgroundColor: selectedCells.some(([r, c]) => r === Math.floor(index / width) && c === index % width)
                    ? "black"
                    : "transparent",
                }}
                onClick={() => handleCellClick(Math.floor(index / width), index % width)}
              />
            ))}

          </div>
        </div>
        <Button>
          <Text font={Font.Bold} size={"5.0rem"} color={colorSet.gray}>
            check
          </Text>
        </Button>
        </Background>
      </Area>
  );
};

export default Main;
