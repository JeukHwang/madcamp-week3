import Area from "../../atoms/containers/area/Area";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import Background from "../../atoms/containers/background/background";
import Button, {ButtonVariant} from "../../atoms/button/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const movePage = useNavigate();

    function main(){
        movePage('/main');
    }
  
    return (
      <Area>
        <Background style={{ padding: "50px" }}>
          <Text size="2.0rem" color="white" font={Font.Bold}>
            개발이 즐거워~
          </Text>
          <Button onClick={main} variant={ButtonVariant.contained}>
            <Text font={Font.Medium}>나도!!</Text>
          </Button>
        </Background>
      </Area>
    );
  };
  
  export default HomePage;
  