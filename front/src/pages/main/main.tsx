import Area from "../../atoms/containers/area/Area";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import colorSet from "../../styles/colorSet";
import Background from "../../atoms/containers/background/background";
import React, { useState } from "react";
import { useEffect } from "react";
const width=7;
const iconcolors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"]
const icons = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒"]
const Main = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState<string[]>([]);


  const createBoard = () => {
  const randomcolorarrangement = []
  for (let i = 0; i < width*width; i++) {
    const randomColor = iconcolors[Math.floor(Math.random()*iconcolors.length)]
    randomcolorarrangement.push(randomColor)
  }
  setCurrentColorArrangement(randomcolorarrangement)
}

useEffect(() => {
createBoard()
}, [width])


console.log(currentColorArrangement)
  return (
            
      <Area>
      <Background color={colorSet.white}>
        <div className="app">
          <div className="game">
            {currentColorArrangement.map((iconcolors, index)=>(
              <img
                key = {index}
                style = {{backgroundColor: iconcolors}}
              />
            ))}

          </div>
        </div>
        </Background>
      </Area>
  );
};

export default Main;
