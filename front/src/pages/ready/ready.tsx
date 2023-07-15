import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import javaIcon from "../../assets/icon/8bit_java.png";
import javaScriptIcon from "../../assets/icon/jss.png";
import pythonIcon from "../../assets/icon/py.png";
import typeScriptIcon from "../../assets/icon/ts.png";
import dartIcon from "../../assets/icon/8bit.png";
import cIcon from "../../assets/icon/c.png";
import cppIcon from "../../assets/icon/cpp.png";
import { ToastContainer, toast } from "react-toastify";
import Background from "../../atoms/containers/background/background";
import Area from "../../atoms/containers/area/Area";
const width=7;
const iconimage = [
    javaIcon,
    javaScriptIcon,
    pythonIcon,
    typeScriptIcon,
    dartIcon,
    cIcon,
    cppIcon,
  ];
const Ready = () => {
  const history = useNavigate();
  const [currentColorArrangement, setCurrentColorArrangement] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [arrayData, setArrayData] = useState<any[]>([]);

  const sendSelectedCells = async () => {
    if (selectedCells.length === 0) {
      toast.warning("아무 것도 선택되지 않았습니다.", { autoClose: 1000 });
      return;
    }
  
    try {
      // Make a POST request to the backend API with the selected cells data
      await axios.post("/api/selected-cells", selectedCells);
      
      // Handle the success response or perform any necessary actions
      console.log("Selected cells sent successfully");
    } catch (error) {
      // Handle any errors that occurred during the API request
      console.error("Error sending selected cells:", error);
    }
  };
  

  const createBoard = () => {
  const randomcolorarrangement = []
  for (let i = 0; i < width*width; i++) {
    const randomColor = iconimage[Math.floor(Math.random()*iconimage.length)]
    randomcolorarrangement.push(randomColor)
  }
  setCurrentColorArrangement(randomcolorarrangement)
}

const handleCellClick = (row: number, col: number) => {
  if (selectedCells.length === 5 && !isCellSelected(row, col)) {
    // Show warning popup when maximum selection limit is reached
    toast.warning("최대 3개까지 선택할 수 있습니다.", { autoClose: 1000 });
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
      toast.warning("연속된 셀만 선택할 수 있습니다.", { autoClose: 1000 });
      return;
    }
  }


  const cellIndex = selectedCells.findIndex(([r, c]) => r === row && c === col);

  if (cellIndex !== -1) {
    // Clicked on an already selected cell, so deselect it
    const isFirstCell = cellIndex === 0;
  const isLastCell = cellIndex === selectedCells.length - 1;

  if (isFirstCell || isLastCell) {
    // 이미 선택된 첫 번째 셀이거나 마지막 셀을 클릭한 경우, 선택 해제합니다.
    const updatedSelectedCells: [number, number][] = selectedCells.filter(([r, c], index) => index !== cellIndex);
    setSelectedCells(updatedSelectedCells);
  } else {
    // 경고 메시지를 토스트로 표시합니다.
    toast.warning("가운데 셀은 해제할 수 없습니다.", { autoClose: 1000 });
  }
  } else {
    // Clicked on a new cell, add it to selected cells
    const updatedSelectedCells: [number, number][] = [...selectedCells, [row, col]];
    setSelectedCells(updatedSelectedCells);
    console.log(row,col);
    console.log(selectedCells);

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
    createBoard();
  }, [width]);

  useEffect(() => {
    axios
      .get("https://madcamp-week3-production.up.railway.app/game/create", { withCredentials: true })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error("API 호출에 실패했습니다.", error.response);
        if (error.response && error.response.status === 403 && error.response.data.message.startsWith("Game exist")) {
          axios
            .get("https://madcamp-week3-production.up.railway.app/game/current", { withCredentials: true })
            .then(response => {
              const arrayData = response.data.json.map;
              setArrayData(arrayData);
            })
            .catch(error => {
              console.error("새로운 API 호출에 실패했습니다.", error);
            });
        } else {
          // Handle other error messages or perform other actions
        }
      });
  }, [history]);

  return (
    <Area>
    <Background color="white">
    <div className="app">
          <div className="game">
            {arrayData.map((data, index) => {
              const languageIcon = iconimage[data.language.toLowerCase()];
              if (!languageIcon) return null; // Skip unknown language

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: selectedCells.some(([r, c]) => r === Math.floor(index / width) && c === index % width)
                      ? "black"
                      : "transparent",
                  }}
                  onClick={() => handleCellClick(Math.floor(index / width), index % width)}
                >
                  <img src={languageIcon} alt={data.language} />
                </div>
              );
            })}
          </div>
        </div>
<ToastContainer position="top-center" 
style={{ width: "400px" }}
className="custom-toast-container"
/>

</Background>
</Area>
  );
};

export default Ready;
