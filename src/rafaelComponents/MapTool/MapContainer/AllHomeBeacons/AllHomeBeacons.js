import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { first } from 'lodash';
import { getDeviceSettings } from 'api/MiddlewareAPI';
import useDeviceId from 'hooks/useDeviceId';
import BeaconMarkersClustered from './BeaconMarkersClustered';

const AllHomeBeacons = ({ recenterMap, onChange }) => {
  const deviceId = useDeviceId();
  const recenterMapRef = useRef(recenterMap);
  const onChangeRef = useRef(onChange);
  const [beacons, setBeacons] = useState();
  const [filteredBeacons, setFilteredBeacons] = useState([]);

  useEffect(() => {
    const fetchBeacons = async devId => {
      setBeacons(
        await getDeviceSettings({
          deviceId: devId,
          type: 'homeBeacons',
        })
      );
    };
    fetchBeacons(deviceId);
  }, [deviceId]);
  useEffect(() => {
    if (beacons) {
      const _filtered = beacons.homeBeacons.filter(
        ({ latitude, longitude }) => latitude && longitude
      );
      setFilteredBeacons(_filtered);
    }
  }, [beacons]);

  recenterMapRef.current = recenterMap;
  onChangeRef.current = onChange;

  useEffect(() => {
    if (onChangeRef.current) {
      onChangeRef.current(filteredBeacons);
    }
    const { latitude, longitude } = first(filteredBeacons) || {};
    const coords =
      latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : null;
    recenterMapRef.current(coords);
  }, [filteredBeacons]);

  if (!filteredBeacons.length) {
    return null;
  }
  return <BeaconMarkersClustered maxZoom={16} beacons={filteredBeacons} />;
};

AllHomeBeacons.propTypes = {
  recenterMap: PropTypes.func,
  onChange: PropTypes.func,
};

AllHomeBeacons.defaultProps = {
  recenterMap: () => {},
  onChange: () => {},
};

export default AllHomeBeacons;
