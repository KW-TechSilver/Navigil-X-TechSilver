import React from 'react';
import BeaconMarkers from './BeaconMarkers';

const BeaconMarkersClustered = ({ beacons, draggableBeacons, moveBeacon }) => (
  <BeaconMarkers moveBeacon={moveBeacon} beacons={beacons} draggable={draggableBeacons} />
);

export default BeaconMarkersClustered;
