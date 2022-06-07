import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import hexToRgba from 'hex-to-rgba';
import { backgroundColorObject } from './cssFunctions/cssFunctions';

const colorVariant = error => (error ? 'danger' : 'primary');

const borderColor = ({ error = false, ...rest }) =>
  backgroundColorObject({ ...rest, color: colorVariant(error) }).main;

const boxShadowColor = props => hexToRgba(borderColor(props), 0.1);

const filter = ['area', 'color', 'overrideColor', 'error', 'displayNone'];

export const Input = styled('input', {
  shouldForwardProp: prop => !filter.includes(prop),
})`
  margin: ${({ margin = '2px 5x' }) => margin};
  padding: 0.5rem;
  font-size: 16px;
  width: ${({ width = 'auto' }) => width};
  display: block;
  border-radius: 4px;
  border: 1px solid #ccc;
  ${({ displayNone }) => (displayNone ? `display: none` : '')}
  ${props => (props.error ? `border-color: ${borderColor(props)};` : '')}
  ${({ area }) => (area ? `grid-area: ${area};` : '')}
  ${({ area }) => (area === 'none' ? `display: none;` : '')}

  :focus {
    border-color: ${borderColor};
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px ${boxShadowColor};
    outline: none;
  }
`;

Input.propTypes = {
  error: PropTypes.bool,
  width: PropTypes.string,
  margin: PropTypes.string,
};

export default Input;
