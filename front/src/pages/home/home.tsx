import Area from "../../atoms/containers/area/Area";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import Background from "../../atoms/containers/background/background";
import Button, {ButtonVariant} from "../../atoms/button/button";
import { useNavigate } from "react-router-dom";
import "../../atoms/containers/background/macTerminal.css";
import axios from "axios";
import colorSet from "../../styles/colorSet";
import { toast, ToastContainer } from "react-toastify";
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
          if(error.response.data.message === "Unauthorized"){
            toast.warning("로그인 후 이용해주세요", { autoClose: 1000 });
            return;
          }
          
        }); 
    };
      
    const board = () => {
     movePage('/board'); 

    }
    const setting = () => {
      movePage('/setting');
    }
  
    return (
      <Area>
        <Background style={{ padding: "50px" }}>
        <div id="bar">
            <div id="red">
            </div>
            <div id="yellow">
            </div>
            <div id="green">
            </div>
        </div>
        <div id="screen">
          <Text size="3.5rem" color="white" font={Font.Bold} style={{padding:"50px"}}
          dangerouslySetInnerHTML={{ __html: "&lt;개발자로 살아남기/&gt;" }}
          />
          <div id="buttonAlign">
          <Button onClick ={moveto} variant={ButtonVariant.outlined}>
            <Text size="1.5rem" font={Font.Bold}>코딩테스트</Text>
          </Button>
          <Button onClick ={board} variant={ButtonVariant.outlined}>
            <Text size="1.5rem" font={Font.Bold}>리더보드</Text>
          </Button>
          <Button variant={ButtonVariant.outlined}>
            <Text color={colorSet.white} size="1.5rem" font={Font.Bold} >
              <a id="a" style={{ color: 'white' }} href="https://madcamp-week3-production.up.railway.app/auth">
                로그인
              </a>
            </Text>
        </Button>
        <Button onClick={setting} variant={ButtonVariant.outlined}>
          <Text size="1.5rem" font={Font.Bold}>💻</Text>
        </Button>

          </div>


        </div>
        <ToastContainer position="top-center" 
        style={{ width: "400px" }}
        />
        </Background>

      </Area>
    );
  };
  
  export default HomePage;
  