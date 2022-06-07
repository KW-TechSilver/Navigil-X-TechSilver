import React from 'react';
import { Circle, Polygon } from 'react-native-maps';
import { geofenceOptions } from './geofenceSettings';

const Geofences = props => {
  const { geofences } = props;
  const handleDoubleClick = () => e => {
    e.stop();
  };

  const mapObjectArray = geofences.map(geofence => {
    switch (geofence.type) {
      case 'circle': {
        return (
          <Circle
            key={geofence.id}
            onClick={handleDoubleClick(geofence)}
            options={geofenceOptions}
            center={{
              lat: geofence.coordinates[0].lat,
              lng: geofence.coordinates[0].lng,
            }}
            radius='150'
          />
        );
      }
      default:
        return (
          <Polygon
            key={geofence.id}
            onClick={handleDoubleClick(geofence)}
            options={geofenceOptions}
            paths={geofence.coordinates}
          />
        );
    }
  });
  return mapObjectArray;
};

export default Geofences;
