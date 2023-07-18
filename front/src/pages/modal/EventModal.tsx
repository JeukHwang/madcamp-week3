import axios from "axios";
import { Console } from "console";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../atoms/button/button";

type event = {title: string, subtitle: string};
const EventModal = ({ onClose }: any) => {
    const [eventtitle, setEventtitle] = useState<string>("");
    const [evensubtitle,setEventsubtitle]=useState<string>("");
    const [eventoptions,setEventoptions]=useState<any[]>();
    const sellect = (index: any) => {
        onClose();
        console.log("선택");
        console.log(index);
        console.log(typeof index);

        axios({
            method: "post",
            url: "https://madcamp-week3-production.up.railway.app/game/update-number",
            data: {
                number: index,
            },
            withCredentials: true,
    
          }).then((response)=> {
            console.log(response);
        })
        .catch(error => {
            console.error("API 호출에 실패했습니다.", error.response);
            });
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
        <div >
            {eventoptions?.map((option, index) => (

                <OptionButton onClick={() => sellect(index)} key={index}>
                    <OptionTitle>{option[0]}</OptionTitle>
                    <OptionSubtitle>{option[1]}</OptionSubtitle>
                </OptionButton>
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