import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import MUIPaper from '@material-ui/core/Paper';
import { VARIANT_NAMES } from 'shared/styledTheme/themeConstants';
import { colorVariant, overrideColorCss } from './cssFunctions/cssFunctions';

const filter = ['color', 'overrideColor'];
const Paper = styled(MUIPaper, {
  shouldForwardProp: prop => !filter.includes(prop),
})`
  ${colorVariant}
  ${overrideColorCss}
`;

Paper.propTypes = {
  color: PropTypes.oneOf(VARIANT_NAMES),
};

export default Paper;
