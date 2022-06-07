import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import MuiButton from '@material-ui/core/Button';
import { VARIANT_NAMES } from 'shared/styledTheme/themeConstants';
import { buttonColorVariant, buttonHover } from './cssFunctions/cssFunctions';

const filter = ['color', 'area', 'overrideColor', 'width'];

const Button = styled(MuiButton, {
  shouldForwardProp: prop => !filter.includes(prop),
})`
  ${({ area }) => (area === 'none' ? 'display: none;' : '')}
  ${({ area }) => (area && area === 'none' ? '' : area ? `grid-area: ${area};` : '')}
  margin: 1px;
  padding: 2px 7px;
  width: ${({ width = 'auto' }) => width};
  & span {
    font-size: ${({ fontSize = 'smaller' }) => fontSize};
  }
  ${buttonColorVariant}
  ${buttonHover}
`;

Button.propTypes = {
  color: PropTypes.oneOf(VARIANT_NAMES),
  overrideColor: PropTypes.string,
  width: PropTypes.string,
  fontSize: PropTypes.string,
};

export default Button;
