import styled from "styled-components";

export interface AreaProps {
  backgroundColor?: string;
  zIndex?: number;
}

const Area = styled.section<AreaProps>`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: white;
`;

export default Area;
