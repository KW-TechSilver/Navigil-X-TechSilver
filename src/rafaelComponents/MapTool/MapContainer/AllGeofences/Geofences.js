import React, { useState, useEffect } from 'react';
import { Circle, Polygon } from 'react-native-maps';
import { useSelector } from 'react-redux';

function hexToRGB(h, opacity) {
  let r = 0;
  let g = 0;
  let b = 0;

  // 3 digits
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;

    // 6 digits
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }

  return `rgba(${+r},${+g},${+b}, ${opacity})`;
}

export const Geofence = ({ geofence, geofenceOptions, ...rest }) => {
  switch (geofence.type) {
    case 'circle': {
      return (
        <Circle
          strokeColor={geofenceOptions.strokeColor}
          fillColor={hexToRGB(geofenceOptions.fillColor, geofenceOptions.fillOpacity)}
          center={{
            latitude: geofence.coordinates[0].lat,
            longitude: geofence.coordinates[0].lng,
          }}
          radius={geofence.radius}
          strokeWidth={geofenceOptions.strokeWeight}
          miterLimit={0}
          zIndex={1}
          {...rest}
        />
      );
    }
    default: {
      const polygonCoordinates = geofence.coordinates.map(gfence => {
        const updateCoordinates = { latitude: gfence.lat, longitude: gfence.lng };
        return updateCoordinates;
      });
      return (
        <Polygon
          coordinates={polygonCoordinates}
          strokeColor={hexToRGB(geofenceOptions.strokeColor, geofenceOptions.strokeOpacity)}
          fillColor={hexToRGB(geofenceOptions.fillColor, geofenceOptions.fillOpacity)}
          strokeWidth={geofenceOptions.strokeWeight}
          {...rest}
        />
      );
    }
  }
};

const Geofences = ({ geofences }) => {
  const baseData = useSelector(store => store.baseData);
  const [geofenceOptions, setGeofenceOptions] = useState(null);

  useEffect(() => {
    if (baseData['circle-colors']) {
      const {
        'circle-colors': {
          geofenceColors: { geofence: _geofenceOptions },
        },
      } = baseData;
      setGeofenceOptions(_geofenceOptions);
    } else {
      setGeofenceOptions(null);
    }
  }, [baseData]);

  if (!geofenceOptions) {
    return null;
  }

  return geofences.map(geofence => (
    <Geofence key={geofence.id} geofence={geofence} geofenceOptions={geofenceOptions} />
  ));
};

export default Geofences;
