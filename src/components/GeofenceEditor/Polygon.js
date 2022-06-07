import React, { useContext } from 'react';
import { Platform } from 'react-native';
import { Marker } from 'react-native-maps';

import { Geofence } from 'rafaelComponents/MapTool/MapContainer/AllGeofences/Geofences';
import { getViewCoordinates, getOriginalCoordinate } from './utils';
import Context from './context';

const Polygon = ({ polygon }) => {
  const context = useContext(Context);
  const {
    selected,
    isEditMode,
    options,
    selectedOptions,
    editGeofence,
    handleGeofencePress,
  } = context;

  const isSelected = polygon.id === selected?.id;
  const showMarkers = isSelected && isEditMode;
  const coordinates = getViewCoordinates(polygon);

  const handleCoordinatePress = (e, i) => {
    e.stopPropagation();
    if (polygon.coordinates.length < 4) {
      return;
    }
    const _coordinates = [...polygon.coordinates];
    _coordinates.splice(i, 1);
    editGeofence({ ...polygon, coordinates: _coordinates });
  };

  const onDragEnd = (e, i) => {
    const _coordinates = [...polygon.coordinates];
    _coordinates[i] = getOriginalCoordinate(e.nativeEvent.coordinate);
    editGeofence({ ...polygon, coordinates: _coordinates });
  };

  return (
    <>
      <Geofence
        geofence={polygon}
        geofenceOptions={isSelected ? selectedOptions : options}
        tappable
        onPress={Platform.OS === 'android' ? () => handleGeofencePress(polygon) : undefined}
      />
      {showMarkers &&
        coordinates.map((coord, i) => (
          <Marker
            key={`${coord.latitude}-${coord.longitude}`}
            coordinate={coord}
            fillColor='#000'
            draggable
            tappable
            isPreselected
            onDragEnd={e => onDragEnd(e, i)}
            onPress={e => handleCoordinatePress(e, i)}
          />
        ))}
    </>
  );
};

export default React.memo(Polygon);
