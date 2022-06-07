import React, { forwardRef } from 'react';
import Icon from '@material-ui/core/Icon';
import styled from '@emotion/styled';
import MUiIconButton from '@material-ui/core/IconButton';
import { buttonColorVariant, buttonHover } from './cssFunctions/cssFunctions';

const filter = ['color', 'disabledOption'];

const StyledIconButton = styled(MUiIconButton, {
  shouldForwardProp: prop => !filter.includes(prop),
})`
  ${buttonColorVariant}
  ${buttonHover}
`;

const IconButton = ({ imageProps = {}, children, ...rest }, ref) => {
  // const { imageProps , children, ...rest } = props;
  const { imageType, ...restImageProps } = imageProps;
  let buttonImg = null;
  switch (imageType) {
    case 'img':
      buttonImg = <img alt='None' {...restImageProps} />;
      break;
    case 'icon':
      buttonImg = <Icon>{imageProps.iconType}</Icon>;
      break;
    default:
      buttonImg = <Icon>done</Icon>;
  }

  return (
    <StyledIconButton ref={ref} {...rest}>
      {children || buttonImg}
    </StyledIconButton>
  );
};

export default forwardRef(IconButton);
