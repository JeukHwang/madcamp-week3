import axios from "axios";
import { Console } from "console";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useAtom } from "jotai";
import { optionchooseAtom, playerPositionAtom, selectedCellsAtom } from "../../utils/atom";
import { responseAtom } from "../../utils/atom";
import Button from "../../atoms/button/button";
import { ToastContainer, toast } from "react-toastify";
import ModalPortal from "../../atoms/containers/background/ModalPortal";
type Position = {x:number, y:number}
type Turn = 0;
type levelLanguage = {C: number, Java: number, Python: number, JavaScript: number, TypeScript: number}
type event = {title: string, subtitle: string};
const EventModal = ({ onClose }: any) => {
    const [response, setResponse] = useAtom(responseAtom);
    const [selectedCells, setSelectedCells] = useAtom(selectedCellsAtom); 
    const [arrayData, setArrayData] = useState<any[]>([]);

    //const [playerPosition, setPlayerPosition] = useState<Position|null>(null);
    const [playerPosition, setPlayerPosition] = useAtom(playerPositionAtom);
  
    const [levelPlayer, setLevelPlayer] = useState<levelLanguage | null>(null);
    const [turnPlayer, SetTurnPlayer] = useState<Turn|null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [request, setRequest] = useState <string>("");
    const [weeklyGoal, setWeeklyGoal] = useState <string>("");
    const [healthRest, setHealthRest] = useState <number>(0);
    const [coffeeGet, setCoffeeGet] = useState <number>(0);
    const [energyGet, setEnergyGet] = useState <number>(0);
    const [levelupState, setLevelupState] = useState <levelLanguage | null>(null);
    const [moneyGet, setMoneyGet] = useState <number>(0);
    const [eventtitle, setEventtitle] = useState<string>("");
    const [evensubtitle,setEventsubtitle]=useState<string>("");
    const [eventoptions,setEventoptions]=useState<any[]>();
    const [visibleOption, setVisibleOption] = useState<any[]>([]);

    const [optionchoose, setOptionchoose] = useAtom(optionchooseAtom);
    const isVisibleOption = (index: number) => {
       // console.log("선택 가능한지 확인", index);
      //  console.log(visibleOption.includes(index));
        return visibleOption.includes(index);
      };
    const sellect = (index: any) => {
        //onClose();
        console.log("선택");
        console.log(index);
        console.log(typeof index);
        if(isVisibleOption(index)===true){
            console.log("선택 가능");
            setOptionchoose(index);
            onClose();
            const positions = selectedCells.map(({ x, y }) => ({ x, y }));
        axios({
            method: "post",
            url: "https://madcamp-week3-production.up.railway.app/game/update-number",
            data: {
                number: index,
            },
            withCredentials: true,
    
          }).then((response)=> {
            console.log(response);
            const isFinished = response.data.json.property.isFinished;
            const require = response.data.json.property.requestInput.type;
            if (require==="number"){
                onClose();
                console.log("숫자 선택");
                //window.location.reload();
                setResponse(response.data);

                setSelectedCells([]);
                
            }
            if(require==="positions"){
                console.log("게임 끝");
                onClose();
                setResponse(response.data);
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
                   const levelup = response.data.json.player.property.level;
                   const require = response.data.json.property.requestInput.type;
                   const turn = response.data.turn;
                   const money = response.data.json.player.property.money;
                   const health = response.data.json.player.property.health;
                   setMoneyGet(money);
                   setHealthRest(health);
                   setLevelupState(levelup);
                   setRequest(require);
                   setArrayData(arrayData);
                   setPlayerPosition(player);
                   setLevelPlayer(level);
                   setLevelupState(levelup);
                   console.log("ready",response.data);
                   setResponse(response.data);
                   
                   SetTurnPlayer(turn);
                    //movePlayerToSelectedCells();
                    setSelectedCells([]);
                
                  }).catch((error) => {
                    console.log(error);
                  });
                setSelectedCells([]);
                
                //setPlayerPosition

                //window.location.reload();
                

            }

        })
        .catch(error => {
            console.error("API 호출에 실패했습니다.", error.response);
            });
        }
        else{
        toast.warning("선택할 수 없습니다.");
        }
    }

    
    useEffect(() => {
        axios
          .get("https://madcamp-week3-production.up.railway.app/game/current", { withCredentials: true })
          .then(response => {
           // console.log(response);
            const eventtitle = response.data.json.property.requestInput.event.title;
            setEventtitle(eventtitle);
            const evensubtitle = response.data.json.property.requestInput.event.subtitle;
            setEventsubtitle(evensubtitle);
            const length = response.data.json.property.requestInput.event.options.length;
            //console.log(length);
            console.log("modal",response.data);
            const visisbleOption = response.data.json.property.requestInput.event.appliableOptions;
            setVisibleOption(visisbleOption);
            //console.log(visisbleOption);
            const eventoptions = new Array(length);
            for(var i=0;i<length;i++){
                eventoptions[i]=[response.data.json.property.requestInput.event.options[i].title, response.data.json.property.requestInput.event.options[i].subtitle];
                //console.log(eventoptions[i][0]);
                //console.log(eventoptions[i][1]);
                setEventoptions(eventoptions);
                //console.log(response.data.json.property.requestInput.event.options[i].title);
                //console.log(response.data.json.property.requestInput.event.options[i].subtitle);
            }
            
          })
          .catch(error => {
            console.error("API 호출에 실패했습니다.", error.response);
          });
        }, []);

  return (
    <Background>
        <Content>
        <ThemedBoxRound>
    <div style={{fontFamily:"DungGeunMo"}}>
      <div>
        <Title>{eventtitle}</Title>
        <Subtitle>{evensubtitle}</Subtitle>
        <Option>선택지를 골라보자</Option>
        <div>
      {eventoptions?.map((option, index) => (
        // Conditionally applying the styles based on the isVisibleOption function
        <StyledButton
          onClick={() => sellect(index)}
          key={index}
          visible={isVisibleOption(index)}
        >
          <OptionTitle>{option[0]}</OptionTitle>
          <OptionSubtitle>{option[1]}</OptionSubtitle>
        </StyledButton>
        
        
      ))}
    </div>
      </div>
    </div>

    </ThemedBoxRound>


    </Content>
    </Background>

  );
};

export default EventModal;


const StyledButton = styled.button<{ visible: boolean }>`
  margin-left: 10%;
  margin-right: 10%;
  width: 80%;
  background: #f7f7f7;
  border: 1px solid #ddd;
  padding: 10px;
  color: #333;

  &:hover {
    ${(props) =>
      props.visible &&
      css`
        background: #888;
        color: #333;
        cursor: pointer;
      `}
  }

  ${(props) =>
    !props.visible &&
    css`
      background: #ddd;
      color: #888; /* Light gray color for text */
      cursor: default; /* Disable hover effect */
    `}
`;

const EventData = styled.div`
  margin-top: 20px;
  background: #f7f7f7;
  border: 1px solid #ddd;
  padding: 10px;
`;

const OptionButton = styled.button`
    margin-left: 10%;
    margin-right: 10%;
    width: 80%;
    background: #f7f7f7;
    border: 1px solid #ddd;
    padding: 10px;

    &:hover {
        /* hover 상태에서의 스타일 */
        background: #ddd;
        color: #333;
        cursor: pointer;
    }
`;
const noneOptionButton = styled.button`
margin-left: 10%;
    margin-right: 10%;
    width: 80%;
    background: #ddd;
    border: 1px solid #ddd;
    padding: 10px;
    color: #000000;
    `;

const PopButton = styled.button`
    margin-left: 10%;
    margin-right: 10%;
    background: #f7f7f7;
    border: 1px solid #ddd;
    padding: 10px;
`;

const Background = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  text-align: center;
`;

const Option = styled.div`
    height: 100%;
    font-size: 1rem;
    font-weight: 600;
    margin: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

const OptionTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 600;
    margin: 1rem;
    display: flex;
    align-items: left;
    justify-content: left;
    font-family: 'DungGeunMo';

`;
const OptionSubtitle = styled.div`
    font-size: 1rem;
    font-weight: 500;
    margin: 1rem;
    display: flex;
    align-items: left;
    justify-content: left;
    font-family: 'DungGeunMo';

`;
const Title = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Subtitle = styled.div`
    font-size: 1rem;
    font-weight: 500;
    margin-left:10%;
    margin-Right:10%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height:1.3;
`;
const Content = styled.div`
  height: 50%;
  width: 40%;
  position: relative;
  overflow: hidden;
  background: white;
  border : 2px black solid;
  border-radius:5px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;

`;



const ThemedBoxRound = styled.div`
    display : inline-grid;

    flex-direction : column;
    justify-content : center;
    text-align : left;
    gap:10px;
    font-size : var(--font-size-h3);
    color: var(--gray3);


`;