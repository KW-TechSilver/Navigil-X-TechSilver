/* eslint jsx-a11y/mouse-events-have-key-events: 0 */

import React, { cloneElement, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { OverlayView, Marker } from '@react-google-maps/api';
import { setAddressMarker } from 'actions/setAddressMarker.js';
import AddressMarkerInfo from './AddressMarkerInfo';

// returns Marker with InfoOverlay with with address info and close and clear options
// InfoOverlay is shown when floated over marker, It can be made sticky/non-sticky by clicking
// marker.
//
// InfoOverlay can be overridden with a child. Child will receive following props:
//  addressMarker:  Object <{ latLng: Google maps LatLng object, address: string}>
//  close:          function to close infoOverlay
//  showClose:      boolean to show closeButton

const AddressMarker = ({ recenterMap, children, overlayViewProps }) => {
  const dispatch = useDispatch();
  useEffect(
    () => () => {
      dispatch(setAddressMarker(null));
    },
    [dispatch]
  );
  const addressMarker = useSelector(store => store.addressMarker);

  const { address, latLng } = addressMarker || {};

  useEffect(() => {
    if (recenterMap && latLng) {
      recenterMap(latLng);
    }
  }, [latLng, recenterMap]);

  const childWithProps = useMemo(
    () =>
      children
        ? cloneElement(children, {
            addressMarker,
          })
        : null,
    [addressMarker, children]
  );

  if (!addressMarker) {
    return null;
  }

  return (
    <Marker position={latLng} label={address} markerOptions={{ zIndex: 1000 }}>
      <OverlayView
        position={latLng}
        style={{ left: '100px', width: '0px', height: '0px' }}
        mapPaneName={OverlayView.FLOAT_PANE}
        {...overlayViewProps}
      >
        {childWithProps || (
          <AddressMarkerInfo
            addressMarker={addressMarker}
            markerLabel={address}
            coordinates={latLng}
            address={address}
          />
        )}
      </OverlayView>
    </Marker>
  );
};

AddressMarker.propTypes = {
  recenterMap: PropTypes.func.isRequired,
  children: PropTypes.element,
  overlayViewProps: PropTypes.object,
};

AddressMarker.defaultProps = {
  children: null,
  overlayViewProps: {},
};

export default AddressMarker;
