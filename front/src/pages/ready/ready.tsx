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

import "../../assets/effect/fadeIn.css";
import "../../assets/effect/fadeOut.css";
import Button from "../../atoms/button/button";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import colorSet from "../../styles/colorSet";
import { ButtonVariant } from "../../atoms/button/button";
import "../../atoms/containers/background/macTerminal.css";
import ModalPortal from "../../atoms/containers/background/ModalPortal";
import EventModal from "../modal/EventModal";
//import "../../atoms/containers/background/macT.css";
//import { TransitionGroup, CSSTransition } from "react-transition-group";
const width=5;
type Position = {x:number, y:number}
type Turn = 0;
type levelLanguage = {C: number, Java: number, Python: number, JavaScript: number, TypeScript: number}
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
  const [levelPlayer, setLevelPlayer] = useState<levelLanguage | null>(null);
  const [turnPlayer, SetTurnPlayer] = useState<Turn|null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [request, setRequest] = useState <string>("");
  const [weeklyGoal, setWeeklyGoal] = useState <string>("");
  const [healthRest, setHealthRest] = useState <number>(0);
  const [coffeeGet, setCoffeeGet] = useState <number>(0);
  const [energyGet, setEnergyGet] = useState <number>(0);
  const HandleModalShow = () => {
    setModalOpen(false);
  };
  const HandleModalOpen = () => {
    setModalOpen(true);
  };
  const sendSelectedCells = async () => {
    if (selectedCells.length === 0) {
      toast.warning("아무 것도 선택되지 않았습니다.", { autoClose: 1000 });
      return;
    }
  
    try {
      // Make a POST request to the backend API with the selected cells data
      const positions = selectedCells.map(({ x, y }) => ({ x, y }));
        //console.log("position", positions);
      // Make a POST request to the backend API with the selected cells data
      if(request === "positions"){
      axios({
        method: "post",
        url: "https://madcamp-week3-production.up.railway.app/game/update-positions",
        data: {
            positions: positions,
        },
        withCredentials: true,

      }).then((response)=> {
        //console.log(response.data.json);
       const arrayData = response.data.json.map;
       const player = response.data.json.player.position;
       const level = response.data.json.player.property.experience;
       const require = response.data.json.property.requestInput.type;
       const turn = response.data.turn;
       setRequest(require);
       setArrayData(arrayData);
       setPlayerPosition(player);
       setLevelPlayer(level);
       
       SetTurnPlayer(turn);
        movePlayerToSelectedCells();
        setSelectedCells([]);
    
      });
    }   
    if(request==="number"){
        HandleModalOpen();
        setSelectedCells([]);
    }
/*       
      await axios.post(
        "https://madcamp-week3-production.up.railway.app/game/update-positions",
        {
          positions: positions,
        },
        {
          withCredentials: true,
        }
      ); */
      
      // Handle the success response or perform any necessary actions
      //console.log("Selected cells sent successfully");
    } catch (error) {
      // Handle any errors that occurred during the API request
      console.error("Error sending selected cells:", error);
    }
  };
  

  const movePlayerToSelectedCells = async () => {
    const delay =600; // Delay between each move in milliseconds
  
    if (!playerPosition || selectedCells.length === 0) {
      return;
    }
  
    const startIndex = 0; // Starting index in the selectedCells array
  
    for (let i = startIndex; i < selectedCells.length; i++) {
      const { x: targetX, y: targetY } = selectedCells[i];
      if(i>0){
      //const {x: pevX, y: prevY} = selectedCells[i-1];
      //console.log(selectedCells);
/*       const cell2 = document.getElementById(`cell-${pevX}-${prevY}`);
      if(cell2){
        cell2.classList.add("fadein");
        console.log("cell2",cell2.classList);
        setTimeout(() => {
            cell2.classList.remove("fadein");
          }, 500);
      } */
      if(i<selectedCells.length-1){
        const {x: nextX, y: nextY} = selectedCells[i+1];
        const cell3 = document.getElementById(`cell-${nextX}-${nextY}`);
        if(cell3){
            cell3.classList.add("fadeout");
            cell3.style.opacity = "0";
           // console.log("cell3",cell3.classList);
        }

      }

      }
        // Fetch the updated arrayData for the target cell
      //const { x: currentX, y: currentY } = playerPosition;
  
      // Calculate the new player position
      const newPosition: Position = { x: targetX, y: targetY };
      //console.log(newPosition);
  
      // Update the player position state
      setPlayerPosition(newPosition);
      // Wait for the delay before moving to the next cell
      await new Promise((resolve) => setTimeout(resolve, delay));


 // Wait for the remaining delay before moving to the next cell
    await new Promise((resolve) => setTimeout(resolve, delay - 200));
        
    // Restore the next cell's appearance after the player moves
    if (i < selectedCells.length - 1) {
    const { x: nextX, y: nextY } = selectedCells[i + 1];
    const cell3 = document.getElementById(`cell-${nextX}-${nextY}`);
    if (cell3) {
        cell3.style.opacity = "1"; // Set the opacity back to 1 to make the cell visible again
        cell3.classList.remove("fadeout"); // Remove the "fadeout" class to restore the original appearance
    }
 }


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
        setArrayData(arrayData);
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

    // Add the "bounce" class to the clicked cell
    const cell = document.getElementById(`cell-${row}-${col}`);
    //console.log(cell);
    if (cell) {
      cell.classList.add("fadein");
      //console.log("cell",cell.classList);

      // Remove the "bounce" class after the animation completes
      setTimeout(() => {
        cell.classList.remove("fadein");
      }, 500);
    }

    
  }
};


const isCellSelected = (row: number, col: number) => {
  return selectedCells.some(({x: r, y: c}) => r === row && c === col);
};

useEffect(() => {
    axios
      .get("https://madcamp-week3-production.up.railway.app/game/current", { withCredentials: true })
      .then(response => {
        const arrayData = response.data.json.map;
        const player = response.data.json.player.position;
        const level = response.data.json.player.property.experience;
        const require = response.data.json.property.requestInput.type;
        const turn = response.data.turn;
        const weekly = response.data.json.property.weeklyGoalData.string;
        const health = response.data.json.player.property.health;
        const coffee = response.data.json.player.property.inventory.커피;
        const energy = response.data.json.player.property.invetory.에너지드링크;
        
        console.log(health);
        //console.log(require);
        console.log(response.data);
        //console.log(level);
        setRequest(require);
        setArrayData(arrayData);
        setPlayerPosition(player);
        setLevelPlayer(level);
        setWeeklyGoal(weekly);
        SetTurnPlayer(turn);
        setHealthRest (health);
        setCoffeeGet(coffee);
        //console.log(coffee);
        setEnergyGet(energy);

        if(require==="number"){
            HandleModalOpen();
        }
        //console.log(turn);
      })
      .catch(error => {
        console.error("API 호출에 실패했습니다. current game 없음", error.response);
          axios
            .get("https://madcamp-week3-production.up.railway.app/game/create", { withCredentials: true })
            .then(response => {
              
                const arrayData = response.data.json.map;
                 setArrayData(arrayData);

                 const player = response.data.json.player.position;
                 setPlayerPosition(player);

                  const level = response.data.json.player.property.level;
                  setLevelPlayer(level);

                  const turn = response.data.turn;
                  //console.log(turn);
                  SetTurnPlayer(turn);

                  const weekly = response.data.json.property.weeklyGoalData.string;
                  setWeeklyGoal(weekly);
            })
            .catch(error => {
              console.error("새로운 API 호출에 실패했습니다.", error);
              if (error.response.data.statusCode === 403 && error.response.data?.message?.startsWith("Game exist")) {
                console.log("이미 해당 게임이 존재합니다.");
                // 이곳에 이미 존재하는 게임에 대한 처리를 추가하면 됩니다.
                axios
                .get("https://madcamp-week3-production.up.railway.app/game/current", { withCredentials: true })
                .then(response => {
                  const arrayData = response.data.json.map;
                  const player = response.data.json.player.position;
                  const level = response.data.json.player.property.experience;
                  const require = response.data.json.property.requestInput.type;
                  const turn = response.data.turn;
                  const weekly = response.data.json.property.weeklyGoalData.string;
                  const health = response.data.json.player.property.health;
                  console.log(health);
                  //console.log(require);
                  console.log(response.data);
                  //console.log(level);
                  setRequest(require);
                  setArrayData(arrayData);
                  setPlayerPosition(player);
                  setLevelPlayer(level);
                  setWeeklyGoal(weekly);
                  SetTurnPlayer(turn);
                  setHealthRest (health);
                })          

                return; // 함수 종료
              }
            });
      }); 
  }, []);
  //console.log(turnPlayer);



//  useEffect(() => {
    // Fetch the updated levelPlayer score from the server
/*     axios
      .get("https://madcamp-week3-production.up.railway.app/game/current", {
        withCredentials: true,
      })
      .then(response => {
        const level = response.data.json.player.property.level;
        setLevelPlayer(level); // Update the levelPlayer state with the new score
      })
      .catch(error => {
        console.error("API 호출에 실패했습니다.", error.response);
      }); */
 // }, [levelPlayer, turnPlayer]); 
//  useEffect(() => {
/*     axios.
        get("https://madcamp-week3-production.up.railway.app/game/current", {
            withCredentials: true,
            })
            .then(response => {
                const turn = response.data.json.turn;
                SetTurnPlayer(turn);
            })
            .catch(error => {
                console.error("API 호출에 실패했습니다.", error.response);
            }); */
///}, [turnPlayer, levelPlayer]);
/*   useEffect(() => {
    createBoard();
  }, [width]); */

  return (
    <Area>
    <Background color="white">
    <div id="modal-root">
    <div id="bar2">
            <div id="red">
            </div>
            <div id="yellow">
            </div>
            <div id="green">
            </div>
        </div>
    <div id="screen2">
      <div>
        {weeklyGoal && (
          <div style={{fontFamily:"DungGeunMo",  fontSize:"1rem", color:colorSet.white}}>
          
            <Text style={{textAlign:"center",padding:"10px"}} color={colorSet.white}>▶ {weeklyGoal}</Text>
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center",fontFamily:"DungGeunMo", fontSize:"1.2rem"}}>
            {healthRest!== null && (
                <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center",fontFamily:"DungGeunMo", fontSize:"1.2rem"}}>
                <Text style={{paddingRight:"20px",}}  > ❤ {healthRest} </Text>
                <Text color={colorSet.white} > ☕ {coffeeGet} </Text>    
                <Text style={{paddingLeft:"20px",}} color={colorSet.white} > ☆ {energyGet} </Text>
                </div>
            )}
        </div>
            <Text style={{textAlign:"center", fontSize:"2rem"}} color={colorSet.white}>----------------</Text>
          </div>
        )}
      </div>

        <div>
          {levelPlayer && (
            <div style={{margin: "0px",display:"flex", justifyContent:"space-between", fontFamily:"DungGeunMo", fontSize:"1.5rem", color:colorSet.white}}>
              <ul style={{margin:"0px"}}>
                <li>C: {levelPlayer.C}</li>
                <li>Java: {levelPlayer.Java}</li>
                <li>Python: {levelPlayer.Python}</li>
              </ul>
              <ul style={{margin:"0px"}}>
                <li>JavaScript: {levelPlayer.JavaScript}</li>
                <li>TypeScript: {levelPlayer.TypeScript}</li>
              </ul>
            </div>

          )}
        </div>
        <div>
            {turnPlayer!== null && (
                <div style={{padding:"10px",fontFamily:"DungGeunMo", fontSize:"1.3rem"}}>
                <Text color={colorSet.white} > ▶ 현재 {turnPlayer} 회 이동</Text>
                    
                </div>
            )}
        </div>

    </div>
    <div className="app">
  <div className="game">
    
    {arrayData.map((data, index) => {
      const languageIcon = iconimage2[data.language];
      const [cellX, cellY] = [Math.floor(index / width), index % width];
      const isPlayerCell = playerPosition?.y === cellY && playerPosition.x === cellX;

      //console.log(playerPosition[0]);
      

      if (!languageIcon) return null; // Skip unknown language

      return (
        <div key={index} >

          <div
            className={`${isPlayerCell ? "" : ""}`}
            id={`cell-${cellX}-${cellY}`}

            style={{
              backgroundColor: selectedCells.some(({x:r, y:c}) => r === cellX && c === cellY)
                ? "black"
                : "transparent",
            }}
            onClick={() => handleCellClick(cellX, cellY)}
          >
            
            <div className="cell-content">
              {isPlayerCell ? (
                <img src={Player} alt="Player" />
              ) : (
                <img src={languageIcon} alt={data.language} />
              )}
            </div>
          </div>
          </div>
      );
    })}
  </div>
</div>
<div style={{alignContent:"center", display:"flex",justifyContent:"center"}}>
<Button  variant={ButtonVariant.commitchange} onClick={sendSelectedCells}>
<Text font={Font.Bold} size={"2.1rem"} color={colorSet.white}>
Commit Changes
</Text>
</Button>
</div>
{modalOpen && (
        <ModalPortal>
          <EventModal onClose={HandleModalShow} />
        </ModalPortal>
      )}
<ToastContainer position="top-center" 
style={{ width: "400px" }}
className="custom-toast-container"
/>
</div>
</Background>
</Area>
  );
};

export default Ready;