import React from "react";
import styled, { css } from "styled-components";
import Font from "../../../../src/styles/font";
export interface TextProps {
    color?: React.CSSProperties["color"];
    font?: Font;
    size?: React.CSSProperties["fontSize"];
    textAlign?: React.CSSProperties["textAlign"];
  }

  const Text = styled.p<TextProps>`
  margin: 0;
  ${({ font }) => {
    switch (font) {
      case Font.Bold:
        return css`
          font-family: "DungGeunMo";
          font-weight: 700;
        `;
      case Font.Medium:
        return css`
          font-family: "DungGeunMo";
          font-weight: 500;
        `;
      case Font.Regular:
        return css`
          font-family: "DungGeunMo";
          font-weight: 400;
        `;
      case Font.Aharoni:
        return css`
          font-family: "DungGeunMo";
          font-weight: 700;
        `;
    }
  }}
  font-size: ${({ size }) => size ?? undefined};
  text-align: ${({ textAlign }) => textAlign ?? "inherit"};
  color: ${({ color }) => color ?? "inherit"};
`;

export default Text;
