import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import useFormatMessage from 'hooks/useFormatMessage';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { Button, ThemeDiv } from 'shared/styledTheme/index';
import { setAddressMarker } from 'actions/setAddressMarker.js';
import InfoOverlay from '../InfoOverlay';

const styles = {
  cardTitle: {
    marginTop: '0',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
};

const CloseButton = ({ handleClick }) => (
  <CancelPresentationIcon style={{ fontSize: 15 }} onClick={handleClick} />
);

const GridAreaItem = styled(ThemeDiv, {
  shouldForwardProp: prop => !['area', 'justifySelf', 'alignSelf'].includes(prop),
})`
  ${({ area }) => (area === 'none' ? 'display: none;' : '')}
  grid-area: ${({ area }) => area};
  ${({ alignSelf }) => (alignSelf ? `align-self: ${alignSelf};` : '')}
  ${({ justifySelf }) => (justifySelf ? `justify-self: ${justifySelf};` : '')}
  cursor: pointer;
`;

const AddressMarkerInfo = ({ addressMarker, classes, close, showClose }) => {
  const { formatMessage } = useFormatMessage();
  const dispatch = useDispatch();

  const { lat, lng } = addressMarker?.latLng || {};

  return (
    <InfoOverlay moveY='calc(-50px - 100%)' moveX='calc(-50%)'>
      <h4 className={classes.cardTitle}>{addressMarker.address}</h4>
      <p>{`${lat().toFixed(4)}, ${lng().toFixed(4)}`}</p>
      {showClose ? (
        <GridAreaItem area='1 / 1 / span 1 / span 1' justifySelf='end' alignSelf='start'>
          <CloseButton handleClick={close} />
        </GridAreaItem>
      ) : null}
      <Button
        size='small'
        color='warning'
        variant='contained'
        onClick={() => {
          dispatch(setAddressMarker(null));
        }}
      >
        {formatMessage({ id: 'general.close' })}
      </Button>
    </InfoOverlay>
  );
};

AddressMarkerInfo.propTypes = {
  addressMarker: PropTypes.shape({
    latLng: PropTypes.shape({ lat: PropTypes.func, lng: PropTypes.func }),
    address: PropTypes.string,
  }),
  close: PropTypes.func,
  showClose: PropTypes.bool,
};

AddressMarkerInfo.defaultProps = {
  addressMarker: {
    latLng: {
      lat: () => {},
      lng: () => {},
    },
    address: null,
  },
  close: () => {},
  showClose: false,
};

export default withStyles(styles)(AddressMarkerInfo);
