import styled from '@emotion/styled';
import Paper from 'shared/styledTheme/Components/Paper';

const GridAreaPaper = styled(Paper, {
  shouldForwardProp: prop => !['area', 'justifySelf', 'alignSelf'].includes(prop),
})`
  ${({ area }) => (area === 'none' ? 'display: none;' : '')}
  grid-area: ${({ area }) => area};
  ${({ alignSelf }) => (alignSelf ? `align-self: ${alignSelf};` : '')}
  ${({ justifySelf }) => (justifySelf ? `justify-self: ${justifySelf};` : '')}
`;

export default GridAreaPaper;
