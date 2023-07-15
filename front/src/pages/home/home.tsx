import Area from "../../atoms/containers/area/Area";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import Background from "../../atoms/containers/background/background";
import Button, {ButtonVariant} from "../../atoms/button/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const HomePage = () => {
    const movePage = useNavigate();
/*     const handleButtonClick = () => {
      window.open('https://madcamp-week3-production.up.railway.app/auth');
    axios.get('https://madcamp-week3-production.up.railway.app/auth', { withCredentials: true })
        .then(response => {
          // API 호출에 성공한 경우 실행될 로직을 작성합니다.
          
          console.log(response);
          window.open('https://madcamp-week3-production.up.railway.app/auth');
        })
        .catch(error => {
          // API 호출에 실패한 경우 실행될 로직을 작성합니다.
          console.error('API 호출에 실패했습니다.', error);
        }); 
    }; */
    
    const moveto = () => {

      axios.get('https://madcamp-week3-production.up.railway.app/test/private', { withCredentials: true })
        .then(response => {
          // API 호출에 성공한 경우 실행될 로직을 작성합니다.
          
         // console.log(response);
          movePage("/ready");
        })
        .catch(error => {
          // API 호출에 실패한 경우 실행될 로직을 작성합니다.
          console.error('API 호출에 실패했습니다.', error);
        }); 
    }
      
    function main(){
        movePage('/main');
    }
    const board = () => {
     movePage('/board'); 

    }
  
    return (
      <Area>
        <Background style={{ padding: "50px" }}>
          <Text size="5.0rem" color="white" font={Font.Bold} style={{padding:"50px"}}
          dangerouslySetInnerHTML={{ __html: "&lt;취업하자/&gt;" }}
          />
          <Button onClick={main} variant={ButtonVariant.contained}>
            <Text size="3.0rem" font={Font.Medium}>지원하기</Text>
          </Button>
          <Button onClick ={moveto} variant={ButtonVariant.outlined}>
            <Text size="3.0rem" font={Font.Bold}>테스트</Text>
          </Button>
          <Button onClick ={board} variant={ButtonVariant.outlined}>
            <Text size="3.0rem" font={Font.Bold}>리더보드</Text>
          </Button>
          <a href="https://madcamp-week3-production.up.railway.app/auth">
            googlelogin
          </a>
        </Background>

      </Area>
    );
  };
  
  export default HomePage;
  