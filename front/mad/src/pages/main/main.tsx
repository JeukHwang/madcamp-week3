import Area from "../../atoms/containers/area/Area";
import Text from "../../atoms/containers/text/text";
import Font from "../../styles/font";
import colorSet from "../../styles/colorSet";
import Background from "../../atoms/containers/background/background";

const Main = () => {
  return (
            
      <Area>
      <Background color={colorSet.red}>
        <Text color="white" size="10rem" font={Font.Bold}>
          진짜로 즐거워?
        </Text>
        </Background>
      </Area>
  );
};

export default Main;
