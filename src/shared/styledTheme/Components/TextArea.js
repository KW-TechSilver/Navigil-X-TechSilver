import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import hexToRgba from 'hex-to-rgba';
import { backgroundColorObject } from './cssFunctions/cssFunctions';

const colorVariant = error => (error ? 'danger' : 'primary');

const borderColor = ({ error = false, ...rest }) =>
  backgroundColorObject({
    ...rest,
    color: colorVariant(error),
  }).main;

const boxShadowColor = props => hexToRgba(borderColor(props), 0.1);

const filter = ['color', 'overrideColor', 'error'];
const TextArea = styled('textarea', {
  shouldForwardProp: prop => !filter.includes(prop),
})`
  margin: 2px 5px;
  padding: 0.5rem;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  width: ${({ width = 'auto' }) => width};
  display: block;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
  overflow: hidden;
  ${props => (props.error ? `border-color: ${borderColor(props)};` : '')} :focus {
    border-color: ${borderColor};
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px ${boxShadowColor};
    outline: none;
  }
`;

TextArea.propTypes = {
  error: PropTypes.bool,
  width: PropTypes.string,
};

export default TextArea;
