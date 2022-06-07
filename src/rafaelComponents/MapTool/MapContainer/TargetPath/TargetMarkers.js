import React from 'react';
import MyMarkers from '../MyMarkers/MyMarkers';

const TargetMarkers = props => {
  const { coordsArray } = props;
  return coordsArray && coordsArray.length > 0 ? <MyMarkers {...props} /> : null;
};

export default TargetMarkers;
