import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { setClickedCoordinates } from 'actions';

const MIN_RADIUS = 200;

const GeofenceCircle = props => {
  const dispatch = useDispatch();
  const { geofence, geofenceOptions, editGeofence, updateGeofence, onDblClick, visible } = props;

  const [dragging, setDragging] = useState(false);

  const circleRef = useRef(null);
  const listenersRef = useRef([]);

  const dragEnd = useCallback(() => {
    const center = circleRef.current.getCenter();
    const coordinates = [{ lat: center.lat(), lng: center.lng() }];
    setDragging(false);
    const _geofence = { ...geofence, coordinates };
    updateGeofence(_geofence);
  }, [geofence, updateGeofence]);

  const dragStart = () => {
    setDragging(true);
  };

  const onRadiusChange = useCallback(() => {
    const radius = Math.ceil(circleRef.current.getRadius());
    if (radius >= MIN_RADIUS) {
      const _geofence = { ...geofence, radius };
      updateGeofence(_geofence);
    } else {
      circleRef.current.setRadius(MIN_RADIUS);
    }
  }, [geofence, updateGeofence]);

  const addListeners = useCallback(() => {
    listenersRef.current.push(circleRef.current.addListener('radius_changed', onRadiusChange));
  }, [onRadiusChange]);

  useEffect(() => {
    if (circleRef.current?.getCenter) {
      listenersRef.current.forEach(lis => lis.remove());
      addListeners();
    }
  }, [dragging, addListeners, geofence]);

  const onLoad = useCallback(
    circle => {
      circleRef.current = circle;
      addListeners();
    },
    [addListeners]
  );

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach(lis => lis.remove());
    circleRef.current = null;
  }, []);
  console.log('circle', geofence);
  if (!geofence) return null;
  return (
    <>
      <Circle
        key='geofence'
        ref={circleRef}
        onClick={e => {
          dispatch(setClickedCoordinates(e.latLng));
        }}
        options={geofenceOptions}
        center={{
          lat: geofence.coordinates[0].lat,
          lng: geofence.coordinates[0].lng,
        }}
        radius={geofence.radius}
        visible={visible}
        draggable={editGeofence}
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        editable={editGeofence}
        onDblClick={onDblClick}
        onLoad={onLoad}
        onUnmount={onUnmount}
      />
    </>
  );
};

GeofenceCircle.propTypes = {
  editGeofence: PropTypes.bool,
  geofence: PropTypes.object.isRequired,
  geofenceOptions: PropTypes.object,
  updateGeofence: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};

export default GeofenceCircle;
