import styled from "styled-components";
import Area from "../area/Area";

const Background = styled(Area)`
  background-color: ${(props) => props.color || "#000000"};
`;

export default Background;
