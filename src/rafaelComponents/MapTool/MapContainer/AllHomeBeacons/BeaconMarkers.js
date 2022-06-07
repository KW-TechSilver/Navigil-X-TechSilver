import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-native-maps';
import { View } from 'react-native';
import HomeBeaconIcon from 'assets/svg/homebeaconTeal.svg';

const BeaconMarkers = ({ beacons }) => {
  const beaconMarkers = beacons.map(beacon => (
    <Marker
      key={beacon.mac}
      zIndex={1}
      coordinate={{
        latitude: parseFloat(beacon.latitude),
        longitude: parseFloat(beacon.longitude),
      }}
    >
      <View
        style={{
          alignItems: 'center',
        }}
      />
      <HomeBeaconIcon width={25} height={25} />
    </Marker>
  ));

  return beaconMarkers;
};

const latLngPropType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
const beaconProptypes = PropTypes.shape({
  latitude: latLngPropType,
  longitude: latLngPropType,
});

BeaconMarkers.propTypes = {
  beacons: PropTypes.arrayOf(beaconProptypes),
  clusterer: PropTypes.oneOfType([() => null, PropTypes.object]),
  draggable: PropTypes.bool,
  icon: PropTypes.string,
  moveBeacon: PropTypes.func,
};

BeaconMarkers.defaultProps = {
  beacons: [],
  clusterer: null,
  draggable: false,
  icon: null,
  moveBeacon: () => {},
};

export default BeaconMarkers;
