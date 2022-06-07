import React, { useState, useMemo } from 'react';
import MyMarkerWithCircle from './MyMarkerWithCircle/MyMarkerWithCircle';
import { signalLostTimeLimit, target } from '../mapSettings';

const MyMarkers = ({ coordsArray, targetLastKnownCoords }) => {
  const { icon } = target;
  const [showSignalLevels, setShowSignalLevels] = useState(false);
  const markerArrayJSX = useMemo(() => {
    const coordsLength = coordsArray.length;
    let noCurrentPosition = false;

    return coordsArray.reverse().map((coords, index) => {
      const lastMarker = index === coordsLength - 1;
      if (lastMarker && coords) {
        if (
          (targetLastKnownCoords &&
            coords &&
            coords.date < targetLastKnownCoords.locationData.date * 1000) ||
          coords.date < new Date().getTime() - signalLostTimeLimit
        )
          noCurrentPosition = true;
      }
      const { beaconName } = coords.locationData;

      return (
        <MyMarkerWithCircle
          key={coords.coordinateId}
          lat={coords.locationData.lat}
          lng={coords.locationData.lng}
          coordinates={coords}
          icon={icon}
          beaconName={beaconName}
          lastMarker={index === coordsLength - 1}
          labelText={(index + 1).toString()}
          noCurrentPosition={noCurrentPosition}
          targetLastKnownCoords={targetLastKnownCoords}
          zIndexNumber={400 + index}
          setShowSignalLevels={setShowSignalLevels}
          showSignalLevels={showSignalLevels}
        />
      );
    });
  }, [coordsArray, icon, showSignalLevels, targetLastKnownCoords]);

  return markerArrayJSX;
};

export default MyMarkers;
