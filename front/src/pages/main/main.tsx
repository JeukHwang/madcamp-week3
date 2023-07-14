import Area from "../../atoms/containers/area/Area";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import colorSet from "../../styles/colorSet";
import Background from "../../atoms/containers/background/background";
import React, { useState } from "react";
import { useEffect } from "react";
import Button from "../../atoms/button/button";
import Icon from "../../assets/icon/Icon";
const width=7;
const iconimage = [
  Icon.Java,
  Icon.Python,
  Icon.JavaScript,
  Icon.TypeScript,


]
const iconcolors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"]
const icons = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒"]
const Main = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const createBoard = () => {
  const randomcolorarrangement = []
  for (let i = 0; i < width*width; i++) {
    const randomColor = iconcolors[Math.floor(Math.random()*iconcolors.length)]
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

/*   if (selectedCells.length > 0) {
    const [prevRow, prevCol] = selectedCells[selectedCells.length - 1];
    const prevColor = currentColorArrangement[prevRow * width + prevCol];
    const currentColor = currentColorArrangement[row * width + col];

    if(prevColor !== currentColor){
      alert("⚠ You can only select adjacent cells with the same color.");
      return;
    }


  } */
  const newSelectedCells = [...selectedCells];
  const cellIndex = newSelectedCells.findIndex(([r, c]) => r === row && c === col);

  if (cellIndex !== -1) {
    // Clicked on an already selected cell, so deselect it
    newSelectedCells.splice(cellIndex, 1);
  } else {
    // Clicked on a new cell, add it to selected cells
    newSelectedCells.push([row, col]);
    console.log(row,col);
  }

  setSelectedCells(newSelectedCells);
};

const isCellSelected = (row: number, col: number) => {
  return selectedCells.some(([r, c]) => r === row && c === col);
};
useEffect(() => {
createBoard()
}, [width])
const [lines, setLines] = useState([
  { from: "topLeft", to: "centerLeft" },
  { from: "bottomCenter", to: "centerRight" }
]);


//console.log(currentColorArrangement)
  return (
            
      <Area>
      <Background color={colorSet.white}>
        <div className="app">
          <div className="game">
            {currentColorArrangement.map((iconcolors, index)=>(
              <img
                key = {index}
                
                style={{
                  backgroundColor: selectedCells.some(([r, c]) => r === Math.floor(index / width) && c === index % width) ? "white" : iconcolors
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
