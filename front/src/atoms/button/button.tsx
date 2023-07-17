import React from "react";
import styled, { css } from "styled-components";

import colorSet from "../../styles/colorSet";

export enum ButtonVariant {
  outlined = "outlined",
  contained = "contained",
  commitchange="commitchange",
}

interface ButtonProps {
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  border?: React.CSSProperties["border"];
  borderRadius?: React.CSSProperties["borderRadius"];
  disabled?: boolean;
  variant?: ButtonVariant;
}

const Button = styled.button<ButtonProps>`
  width: ${({ width }) => (width ? width : undefined)};
  height: ${({ height }) => (height ? height : undefined)};
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  transition: 0.1s;

  ${({ variant }) => {
    switch (variant) {
      case ButtonVariant.outlined:
        return css`
          border: 5px solid ${colorSet.white};
          border-radius: 5px;
          padding: 10px 20px;
          color: ${colorSet.white};

          :hover {
            background-color: ${colorSet.gray};
          }
        `;
        case ButtonVariant.commitchange:
        return css`
          border: 1px solid ${colorSet.green};
          background-color: ${colorSet.green};
          border-radius: 10px;
          padding: 10px 20px;
          color: ${colorSet.white};

          :hover {
            background-color: ${colorSet.lightgreen};
          }
        `;
      case ButtonVariant.contained:
        return css`
          background-color: ${colorSet.gray};
          border-radius: 5px;
          padding: 10px 20px;
          color: ${colorSet.colorless};

          :hover {
            box-shadow: inset rgba(0, 0, 0, 0.15) 0px 0px 0px 40px;
          }
        `;
    }
  }}
  ${({ border }) => css`
    border: ${border};
  `}
  :hover {
    cursor: pointer;
  }
`;

export default Button;
