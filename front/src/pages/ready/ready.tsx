import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Java from "../../assets/icon/8bit_java.png";
import JavaScript from "../../assets/icon/jss.png";
import Python from "../../assets/icon/py.png";
import TypeScript from "../../assets/icon/ts.png";
import Dart from "../../assets/icon/8bit.png";
import C from "../../assets/icon/c.png";
import Cpp from "../../assets/icon/cpp.png";
import { ToastContainer, toast } from "react-toastify";
import Background from "../../atoms/containers/background/background";
import Area from "../../atoms/containers/area/Area";
import Player from "../../assets/icon/programming.png";
import "../../assets/effect/bouncingAnimation.css";
import Button from "../../atoms/button/button";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import colorSet from "../../styles/colorSet";
import { ButtonVariant } from "../../atoms/button/button";
const width=7;
type Position = {x:number, y:number}
const Ready = () => {
    const iconimage2: Record<string, string> = {
        Java,
        JavaScript,
        Python,
        TypeScript,
        Dart,
        C,
        Cpp,
      };
  const history = useNavigate();
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [arrayData, setArrayData] = useState<any[]>([]);
  const [playerPosition, setPlayerPosition] = useState<Position|null>(null);

  const sendSelectedCells = async () => {
    if (selectedCells.length === 0) {
      toast.warning("아무 것도 선택되지 않았습니다.", { autoClose: 1000 });
      return;
    }
  
    try {
      // Make a POST request to the backend API with the selected cells data
      const positions = selectedCells.map(({ x, y }) => ({ x, y }));
        console.log("position", positions);
      // Make a POST request to the backend API with the selected cells data
      
      axios({
        method: "post",
        url: "https://madcamp-week3-production.up.railway.app/game/update",
        data: {
            positions: positions,
        },
        withCredentials: true,

      }).then((res)=> {
        console.log(res);
        movePlayerToSelectedCells();

        setSelectedCells([]);
        

        
        
        
        
      });
      
      await axios.post(
        "https://madcamp-week3-production.up.railway.app/game/update",
        {
          positions: positions,
        },
        {
          withCredentials: true,
        }
      );
      
      // Handle the success response or perform any necessary actions
      console.log("Selected cells sent successfully");
    } catch (error) {
      // Handle any errors that occurred during the API request
      console.error("Error sending selected cells:", error);
    }
  };
  

  const movePlayerToSelectedCells = async () => {
    const delay = 500; // Delay between each move in milliseconds
  
    if (!playerPosition || selectedCells.length === 0) {
      return;
    }
  
    const startIndex = 0; // Starting index in the selectedCells array
  
    for (let i = startIndex; i < selectedCells.length; i++) {
      const { x: targetX, y: targetY } = selectedCells[i];
      console.log(selectedCells);
  
      const { x: currentX, y: currentY } = playerPosition;
  
      const diffX = targetX - currentX;
      const diffY = targetY - currentY;
  
      // Calculate the new player position
      const newPosition: Position = { x: targetX, y: targetY };
      console.log(newPosition);
  
      // Update the player position state
      setPlayerPosition(newPosition);
  
      // Wait for the delay before moving to the next cell
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  
    // Fetch the updated arrayData for the target cell
    const { x: targetX, y: targetY } = selectedCells[selectedCells.length - 1];
    fetchUpdatedArrayData(targetX, targetY);
  };
  
  const fetchUpdatedArrayData = (targetX: number, targetY: number) => {
    axios
      .get("https://madcamp-week3-production.up.railway.app/game/current", {
        withCredentials: true,
      })
      .then((response) => {
        const arrayData = response.data.json.map;
        const player = response.data.json.player.position;
        setArrayData((prevArrayData) => {
          const updatedArrayData = prevArrayData.map((data) => {
            if (data.x === targetX && data.y === targetY) {
              // Update the specific cell with new data
              // For example:
              return {
                ...data,
                // Update the necessary properties
              };
            }
            return data;
          });
          return updatedArrayData;
        });
        setPlayerPosition(player);
      })
      .catch((error) => {
        console.error("API 호출에 실패했습니다.", error.response);
      });
  };
  
  const createBoard = () => {
  for (let i = 0; i < width*width; i++) {
  }

}

const handleCellClick = (row: number, col: number) => {
  if (selectedCells.length === 5 && !isCellSelected(row, col)) {
    // Show warning popup when maximum selection limit is reached
    toast.warning("최대 5개까지 선택할 수 있습니다.", { autoClose: 1000 });
    return;
  }
  if(selectedCells.length===0){
    if(row===playerPosition?.x && col===playerPosition?.y){
      toast.warning("시작점을 선택할 수 없습니다.", { autoClose: 1000 });
      return;
    }
    
    if(!((((row+1)===playerPosition?.x) && (col===playerPosition?.y)) || ((col+1)===playerPosition?.y && row===playerPosition?.x) || ((row-1)===playerPosition?.x && col===playerPosition?.y )|| ((col-1)===playerPosition?.y && row===playerPosition?.x))){
      toast.warning("시작점과 인접하지 않습니다.", { autoClose: 1000 });
      
      return;
    }

  }
  if (selectedCells.length > 0) {
    const {x: prevRow, y: prevCol} = selectedCells[selectedCells.length - 1];
    if (
      Math.abs(prevRow - row) > 1 ||
      Math.abs(prevCol - col) > 1 ||
      (Math.abs(prevRow - row) === 1 && Math.abs(prevCol - col) === 1)
    ) {
      // Show alert when the selected cell is not adjacent to the previous cell
      toast.warning("연속된 셀만 선택할 수 있습니다.", { autoClose: 1000 });
      return;
    }
  }

  const cellIndex = selectedCells.findIndex(({x: r, y: c}) => r === row && c === col);

  if (cellIndex !== -1) {
    // Clicked on an already selected cell, so deselect it
    const isFirstCell = cellIndex === 0;
  const isLastCell = cellIndex === selectedCells.length - 1;

  if (isFirstCell || isLastCell) {
    // 이미 선택된 첫 번째 셀이거나 마지막 셀을 클릭한 경우, 선택 해제합니다.
    const updatedSelectedCells: Position[] = selectedCells.filter(({x: r, y: c}, index) => index !== cellIndex);
    setSelectedCells(updatedSelectedCells);
  } else {
    // 경고 메시지를 토스트로 표시합니다.
    toast.warning("가운데 셀은 해제할 수 없습니다.", { autoClose: 1000 });
  }
  } else {
    // Clicked on a new cell, add it to selected cells
    const updatedSelectedCells = [...selectedCells, {x: row, y: col}];
    setSelectedCells(updatedSelectedCells);
    //console.log(setSelectedCells);
    console.log(updatedSelectedCells);
    console.log("row col", row,col);

    // Add the "bounce" class to the clicked cell
    const cell = document.getElementById(`cell-${row}-${col}`);
    //console.log(cell);
    if (cell) {
      cell.classList.add("bounce");
      //console.log("cell",cell);

      // Remove the "bounce" class after the animation completes
      setTimeout(() => {
        cell.classList.remove("bounce");
      }, 500);
    }

    
  }
};


const isCellSelected = (row: number, col: number) => {
  return selectedCells.some(({x: r, y: c}) => r === row && c === col);
};
useEffect(() => {
    createBoard();
  }, [width]);

  useEffect(() => {
    axios
      .get("https://madcamp-week3-production.up.railway.app/game/current", { withCredentials: true })
      .then(response => {
        const arrayData = response.data.json.map;
        const player = response.data.json.player.position;
             // console.log("player",player);
              setArrayData(arrayData);
              setPlayerPosition(player);
             // console.log("playerPosition",playerPosition);
      })
      .catch(error => {
        console.error("API 호출에 실패했습니다.", error.response);
        
          axios
            .get("https://madcamp-week3-production.up.railway.app/game/create", { withCredentials: true })
            .then(response => {
                const arrayData = response.data.json.map;
                // console.log(arrayData);
                 setArrayData(arrayData);
                 const player = response.data.json.player.position;
                 setPlayerPosition(player);
            })
            .catch(error => {
              console.error("새로운 API 호출에 실패했습니다.", error);
            });
      });
  }, [history]);

  return (
    <Area>
    <Background color="white">
    <div className="app">
  <div className="game">
    {arrayData.map((data, index) => {
      const languageIcon = iconimage2[data.language];
      const [cellX, cellY] = [Math.floor(index / width), index % width];
      const isPlayerCell = playerPosition?.y === cellY && playerPosition.x === cellX;

      //console.log(playerPosition[0]);
      

      if (!languageIcon) return null; // Skip unknown language

      return (
        <div
          key={index}
          style={{
            backgroundColor: selectedCells.some(({x:r, y:c}) => r === cellX && c === cellY)
              ? "black"
              : "transparent",
          }}
          onClick={() => handleCellClick(cellX, cellY)}
        >
          {isPlayerCell ? <img src={Player} alt="Player" /> : <img src={languageIcon} alt={data.language} />}
        </div>
      );
    })}
  </div>
</div>

<Button variant={ButtonVariant.commitchange} onClick={sendSelectedCells}>
<Text font={Font.Bold} size={"2.1rem"} color={colorSet.white}>
Commit Changes
</Text>
</Button>

<ToastContainer position="top-center" 
style={{ width: "400px" }}
className="custom-toast-container"
/>

</Background>
</Area>
  );
};

export default Ready;
