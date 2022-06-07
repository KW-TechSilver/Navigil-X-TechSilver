import React, { useContext } from 'react';
import { Platform } from 'react-native';
import { Marker } from 'react-native-maps';

import { Geofence } from 'rafaelComponents/MapTool/MapContainer/AllGeofences/Geofences';
import { getViewCoordinate, getOriginalCoordinate } from './utils';
import Context from './context';

const Circle = ({ circle }) => {
  const context = useContext(Context);
  const { selected, options, selectedOptions, editGeofence, handleGeofencePress } = context;

  const coord = getViewCoordinate(circle.coordinates[0]);
  const isSelected = circle.id === selected?.id;

  const onDragEnd = e => {
    const _coordinates = [...circle.coordinates];
    _coordinates[0] = getOriginalCoordinate(e.nativeEvent.coordinate);
    editGeofence({ ...circle, coordinates: _coordinates });
  };

  return (
    <>
      <Geofence
        geofence={circle}
        key={circle.id}
        geofenceOptions={isSelected ? selectedOptions : options}
        onPress={Platform.OS === 'android' ? () => handleGeofencePress(circle) : undefined}
      />
      {isSelected && (
        <Marker
          key={`${coord.latitude}-${coord.longitude}`}
          coordinate={coord}
          fillColor='#000'
          draggable
          isPreselected
          stopPropagation
          onDragEnd={e => onDragEnd(e)}
        />
      )}
    </>
  );
};
export default React.memo(Circle);
