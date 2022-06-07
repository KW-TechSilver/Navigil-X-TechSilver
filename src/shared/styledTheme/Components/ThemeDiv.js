import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { VARIANT_NAMES } from 'shared/styledTheme/themeConstants';
import { colorVariant, overrideColorCss } from './cssFunctions/cssFunctions';

const filter = ['color', 'overrideColor', 'overrideBackgroundColor'];

const ThemeDiv = styled('div', {
  shouldForwardProp: prop => !filter.includes(prop),
})`
  ${colorVariant}
  ${overrideColorCss}
`;

ThemeDiv.propTypes = {
  color: PropTypes.oneOf(VARIANT_NAMES),
};

export default ThemeDiv;
