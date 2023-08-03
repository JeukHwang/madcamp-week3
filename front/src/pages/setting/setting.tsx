import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Text from "../../atoms/containers/text/text";

const Setting = () => {
  const [textColor, setTextColor] = useState("#fff"); // Initial text color is white

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random color for the text
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      setTextColor(randomColor);
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <RainbowBackground>
      <BlinkingText style={{ color: textColor }}>멋쟁이 개발자 황제욱</BlinkingText>
      <BlinkingText style={{ color: textColor }}>멋쟁이 개발자 심수연</BlinkingText>
      <FloatingText style={{ color: textColor }}>멋져~</FloatingText>
      <FloatingText2 style={{ color: textColor }}>갱장해~~</FloatingText2>
    </RainbowBackground>
  );
};

const blinkAnimation = keyframes`
  0%, 100% {
    opacity: 1;
    transform: translate(0, 0);
  }
  25% {
    opacity: 0.5;
    transform: translate(15px, 10px);
  }
  50% {
    opacity: 1;
    transform: translate(-10px, -15px);
  }
  75% {
    opacity: 0.5;
    transform: translate(-20px, 20px);
  }
`;

const FloatingAnimation = keyframes`
  0% {
    transform: translate(calc(-100vw/2), calc(-100vh/2));
  }
  100% {
    transform: translate(calc(100vw/2), calc(100vh/2));
  }
`;
const FloatingAnimation2 = keyframes`
  0% {
    transform: translate(calc(100vw/2), calc(100vh/2));
  }
  100% {
    transform: translate(calc(-100vw/2), calc(-100vh/2));
  }
`;

const FloatingText2 = styled(Text)`
  /* Add any additional styles you want for the floating text here */
  font-size: 36px;
  font-color: white;
  animation: ${FloatingAnimation2} 2s infinite alternate;
`;

const FloatingText = styled(Text)`
  /* Add any additional styles you want for the floating text here */
  font-size: 36px;
  font-color: white;
  animation: ${FloatingAnimation} 2s infinite alternate;
`;
const BlinkingText = styled(Text)`
  /* Add any additional styles you want for the blinking text here */
  animation: ${blinkAnimation} 0.5s infinite;
  transition: color 0.1s ease-in-out;
`;

const AAA = styled.div`
  /* Your existing styles for AAA */
  font-family: 'DungGeunMo';
  font-size: 68px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  width: 100vw;
  height: 100vh;
  text-shadow: 8px 8px 10px #0000008c;
  background-color: #343a40;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%239C92AC' fill-opacity='0.25' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), linear-gradient(to right top, #343a40, #2b2c31, #211f22, #151314, #000000);
`;
const RainbowBackground = styled.div`
  /* Your styles for the diagonal rainbow gradient background */
  font-family: 'DungGeunMo';
  font-size: 68px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  width: 100vw;
  height: 100vh;
  text-shadow: 8px 8px 10px #000000;
  background-image: linear-gradient(to bottom right, violet, indigo, blue, green, yellow, orange, red);
`;
export default Setting;
