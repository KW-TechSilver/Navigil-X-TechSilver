import { css } from '@emotion/react';
import hexToRgba from 'hex-to-rgba';

export const backgroundColorObject = ({ theme: { palette }, color }) => {
  if (color && color !== 'initial') {
    return palette[color];
  }
  return {
    main: '',
    light: '',
    dark: '',
  };
};

export const rotate = ({ degrees }) =>
  css`
    transform: rotate(${degrees || '90'}deg);
  `;

export const buttonHover = ({ color, theme, variant: muiVariant }) => {
  const isInitial = !color || color === 'initial';
  if (isInitial) {
    return '';
  }
  let colorsCss = '';
  switch (muiVariant) {
    case 'contained':
      colorsCss = css`
        ${!isInitial ? `background-color: ${theme.palette[color]?.dark};` : ''};
      `;
      break;
    case 'outlined':
      colorsCss = css`
        border-color: ${!isInitial ? theme.palette[color]?.dark : ''};
        ${!isInitial ? `background-color: ${hexToRgba(theme.palette[color]?.main, 0.08)};` : ''};
        ${!isInitial ? `color: ${theme.palette[color]?.main};` : ''};
      `;
      break;
    default:
      colorsCss = css`
        background-color: ${hexToRgba(!isInitial ? theme.palette[color]?.main : '', 0.08)};
        color: ${!isInitial ? theme.palette[color]?.main : ''};
      `;
      break;
  }
  const hoverCss = css`
    &:hover {
      ${colorsCss}
    }
  `;
  return hoverCss;
};

export const buttonColorVariant = ({
  color,
  theme: { palette },
  variant: muiVariant,
  overrideColor,
}) => {
  if (color && color !== 'initial' && color !== 'inherit') {
    let buttonCss = '';
    let colorCss = css`
      color: ${palette[color]?.main};
    `;
    if (overrideColor) {
      colorCss = css`
        color: ${overrideColor};
      `;
    }
    switch (muiVariant) {
      case 'contained':
        if (!overrideColor) {
          colorCss = css`
            color: ${palette[color]?.contrastText};
          `;
        }
        buttonCss = css`
          background-color: ${palette[color]?.main};
          ${colorCss}
        `;
        break;
      case 'outlined':
        buttonCss = css`
          border-color: ${palette[color]?.main};
          ${colorCss}
        `;
        break;
      default:
        buttonCss = css`
          ${colorCss}
        `;
        break;
    }
    return buttonCss;
  }
  return '';
};

export const colorVariant = ({ theme: { palette }, color = 'initial' }) => {
  if (color && color !== 'initial') {
    return css`
      background-color: ${color === 'inherit' ? 'inherit' : palette[color]?.main};
      color: ${color === 'inherit' ? 'inherit' : palette[color]?.contrastText};
    `;
  }
  return '';
};

export const overrideColorCss = ({ overrideColor, overrideBackgroundColor }) => {
  const colorCSS = css`
    ${overrideColor ? `color: ${overrideColor};` : ''}
    ${overrideBackgroundColor ? `background-color: ${overrideBackgroundColor};` : ''}
  `;
  return colorCSS;
};
