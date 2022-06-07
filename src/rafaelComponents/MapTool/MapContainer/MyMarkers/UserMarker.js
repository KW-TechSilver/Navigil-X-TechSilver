/* global google */
import React, { useState } from 'react';
import { OverlayView, Marker } from '@react-google-maps/api';
import InfoOverlay from './InfoOverlay';

const UserMarker = props => {
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [showInfoWindowPersist, setShowInfoWindowPersist] = useState(false);

  const { user } = props;
  if (!user.coords) {
    return null;
  }
  const handleMarkerClick = () => {
    setShowInfoWindowPersist(!showInfoWindowPersist);
  };
  const handleMouseOver = () => {
    setShowInfoWindow(true);
  };
  const handleMouseOut = () => {
    setShowInfoWindow(false);
  };

  const defaultIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 10,
    strokeWeight: 2,
    strokeColor: 'green',
    fillOpacity: 0.5,
    fillColor: 'green',
  };

  const {
    coords: { latLng },
    name,
    phone,
    icon,
  } = user;

  return (
    <Marker
      title={`${latLng.lat()}, ${latLng.lng()}`}
      position={latLng}
      onClick={event => handleMarkerClick(event)}
      onMouseOver={event => handleMouseOver(event)}
      onFocus={event => handleMouseOver(event)}
      onMouseOut={event => handleMouseOut(event)}
      onBlur={event => handleMouseOut(event)}
      icon={icon || defaultIcon}
      zIndex={300}
    >
      {showInfoWindow || showInfoWindowPersist ? (
        <OverlayView position={latLng} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <InfoOverlay moveY='-20px'>
            {name}, phone: <a href={`tel:${phone}`}>{phone}</a>
          </InfoOverlay>
        </OverlayView>
      ) : null}
    </Marker>
  );
};

export default UserMarker;
