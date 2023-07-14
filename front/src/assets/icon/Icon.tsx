import React from "react";
import styled from "styled-components";

import java from "../../assets/icon/java.svg";
import javascript from "../../assets/icon/javascript.svg";
import python from "../../assets/icon/python.svg";
import typescript from "../../assets/icon/typescript.svg";

interface EachIconProps {
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
  }
  
  interface IconProps extends EachIconProps {
    src: string;
    alt?: string;
  }
  
  interface IconImgProps {
    cssWidth?: React.CSSProperties["width"];
    cssHeight?: React.CSSProperties["height"];
  }
  
  const IconImg = styled.img<IconImgProps>`
    width: ${({ cssWidth }) => (cssWidth ? cssWidth : null)};
    height: ${({ cssHeight }) => (cssHeight ? cssHeight : null)};
  `;
  
  const Icon = ({ src, alt, width, height }: IconProps) => {
    return <IconImg src={src} alt={alt} cssWidth={width} cssHeight={height} />;
  };

  const Java = ({width, height}: EachIconProps) => {
    return(
    <IconImg
    src = {java}
    alt = {"java"}
    cssWidth = {width}
    cssHeight = {height}
    />
    );
  };

    const JavaScript = ({width, height}: EachIconProps) => {
    return(
    <IconImg
    src = {javascript}
    alt = {"javascript"}
    cssWidth = {width}
    cssHeight = {height}
    />
    );
    }

    const Python = ({width, height}: EachIconProps) => {
    return(
    <IconImg
    src = {python}
    alt = {"python"}
    cssWidth = {width}
    cssHeight = {height}
    />
        
    );
    }

    const TypeScript = ({width, height}: EachIconProps) => {
    return(
    <IconImg
    src = {typescript}
    alt = {"typescript"}
    cssWidth = {width}
    cssHeight = {height}
    />
    );
    }

  Icon.Java = Java;
    Icon.JavaScript = JavaScript;
    Icon.Python = Python;
    Icon.TypeScript = TypeScript;
    

  export default Icon;