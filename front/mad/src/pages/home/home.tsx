import Area from "../../atoms/containers/area/Area";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import Background from "../../atoms/containers/background/background";
import Button, {ButtonVariant} from "../../atoms/button/button";
import { useNavigate } from "react-router-dom";
import GameBoard from "../../atoms/gameBoard/gameBoard";
import axios from "axios";
const HomePage = () => {
    const movePage = useNavigate();
    const handleButtonClick = () => {
        // API 호출 로직을 작성합니다.
        // 예를 들어, axios를 사용하여 API를 호출하는 코드를 작성할 수 있습니다.
        axios.get('/api/google-login')
          .then(response => {
            // API 호출에 성공한 경우 실행될 로직을 작성합니다.
          })
          .catch(error => {
            // API 호출에 실패한 경우 실행될 로직을 작성합니다.
          });
      };
      
    function main(){
        movePage('/main');
    }
  
    return (
      <Area>
        <Background style={{ padding: "50px" }}>
          <Text size="5.0rem" color="white" font={Font.Bold} style={{padding:"50px"}}>
            개발이 즐거워~
          </Text>
          <Button onClick={main} variant={ButtonVariant.contained}>
            <Text size="3.0rem" font={Font.Medium}>나도!!</Text>
          </Button>
          <Button onClick ={handleButtonClick} variant={ButtonVariant.outlined}>
            <Text size="3.0rem" font={Font.Bold}>구글 로그인</Text>
          </Button>
        </Background>

      </Area>
    );
  };
  
  export default HomePage;
  