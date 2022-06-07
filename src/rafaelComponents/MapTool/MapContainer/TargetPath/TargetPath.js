import React, { useState, useEffect } from 'react';
import TargetMarkers from './TargetMarkers';
import MyPolyline from '../MyPolyline/MyPolyline';

const TargetPath = props => {
  const { coordsArray, ...rest } = props;
  const [polyLineCoords, setPolyLineCoords] = useState();
  useEffect(() => {
    const _coordinates = [];
    if (coordsArray) {
      coordsArray.forEach(coords => {
        _coordinates.push({
          latitude: coords && coords.locationData.lat,
          longitude: coords && coords.locationData.lng,
        });
      });
    }

    setPolyLineCoords(_coordinates);
  }, [coordsArray]);

  return (
    <>
      {polyLineCoords && polyLineCoords.length > 0 ? (
        <MyPolyline pathCoords={polyLineCoords} {...rest} />
      ) : null}
      <TargetMarkers {...rest} coordsArray={coordsArray} />
    </>
  );
};

export default TargetPath;
