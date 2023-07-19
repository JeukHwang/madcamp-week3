import Background from "../../atoms/containers/background/background";
import styled from "styled-components";

const EventModal2 = ({ onClose }: any) => {
return (

    <Background>
        <Content>
        <ThemedBoxRound>
    <div style={{fontFamily:"DungGeunMo"}}>
      <div>
        <Title>개발자님! 수고하셨습니다!</Title>
        <Subtitle></Subtitle>
        

      </div>
    </div>

    </ThemedBoxRound>


    </Content>
    </Background>
);
}

export default EventModal2;

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