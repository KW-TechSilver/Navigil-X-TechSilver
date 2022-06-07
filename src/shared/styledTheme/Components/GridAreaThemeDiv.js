import styled from '@emotion/styled';
import ThemeDiv from 'shared/styledTheme/Components/ThemeDiv';

const GridAreaThemeDiv = styled(ThemeDiv, {
  shouldForwardProp: prop => !['area', 'justifySelf', 'alignSelf'].includes(prop),
})`
  ${({ area }) => (area === 'none' ? 'display: none;' : '')}
  grid-area: ${({ area }) => area};
  ${({ alignSelf }) => (alignSelf ? `align-self: ${alignSelf};` : '')}
  ${({ justifySelf }) => (justifySelf ? `justify-self: ${justifySelf};` : '')}
`;

export default GridAreaThemeDiv;
