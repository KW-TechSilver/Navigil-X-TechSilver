import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Paper } from 'shared/styledTheme';

const OverlayPaper = styled(Paper, {
  shouldForwardProp: prop => !['moveX', 'moveY'].includes(prop),
})`
  display: grid;
  transform: translate(${props => props.moveX}, ${props => props.moveY});
  padding: 10px;
  width: 250px;
  height: auto;
`;

const InfoOverlay = ({ children, moveY, moveX, ...rest }) => {
  const ref = useRef(null);
  const [parent, setParent] = useState(null);

  useEffect(() => {
    if (parent) {
      parent.style.width = '0px';
    }
  }, [parent]);

  if (!parent && ref.current) {
    setParent(ref.current.parentElement);
  }
  return (
    <OverlayPaper ref={ref} moveY={moveY} moveX={moveX} {...rest}>
      {children}
    </OverlayPaper>
  );
};

InfoOverlay.propTypes = {
  moveY: PropTypes.string,
  moveX: PropTypes.string,
};

InfoOverlay.defaultProps = {
  moveY: '0px',
  moveX: '0px',
};

export default InfoOverlay;
