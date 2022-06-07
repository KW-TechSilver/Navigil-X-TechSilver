import React from 'react';
import { Platform } from 'react-native';
import { Polyline } from 'react-native-maps';

const MyPolyline = props => {
  const { pathCoords, targetLastKnownCoords, filter } = props;
  const coordsArrayChecked =
    pathCoords && pathCoords.length === 0
      ? targetLastKnownCoords && targetLastKnownCoords.date <= filter
        ? filter.endDate
        : new Date()
        ? [targetLastKnownCoords]
        : []
      : [...pathCoords];
  return coordsArrayChecked && coordsArrayChecked.length > 0 ? (
    <Polyline
      coordinates={coordsArrayChecked}
      strokeWidth={1}
      lineJoin='miter'
      strokeColor='#D10000'
      miterLimit={15}
      lineDashPhase={0}
      lineCap='butt'
      lineDashPattern={Platform.OS === 'android' ? [15] : [0]}
      geodesic
      tappable
    />
  ) : null;
};

export default MyPolyline;
