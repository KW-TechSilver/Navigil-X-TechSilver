import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setGeofenceInProgress } from 'actions';
import GeofenceCircle from './GeofenceCircle';

const GeofenceInProgress = ({
  editGeofenceInProgress,
  geofenceInProgress,
  geofenceOptionsProps,
  updateGeofence,
}) => {
  const dispatch = useDispatch();
  const baseData = useSelector(store => store.baseData);
  const handleDoubleClick = useCallback(
    e => {
      if (geofenceInProgress) {
        e.stop();
        dispatch(setGeofenceInProgress(null));
      }
    },
    [dispatch, geofenceInProgress]
  );
  const [geofenceInProgressOptions, setGeofenceInProgressOptions] = useState(null);

  useEffect(() => {
    if (baseData['circle-colors']) {
      const {
        'circle-colors': {
          geofenceColors: { geofenceInProgress: _geofenceInProgressOptions },
        },
      } = baseData;
      setGeofenceInProgressOptions(_geofenceInProgressOptions);
    } else {
      setGeofenceInProgressOptions(null);
    }
  }, [baseData]);

  if (!geofenceInProgressOptions) {
    return null;
  }

  if (!geofenceInProgress) {
    return null;
  }
  const geofenceProps = {
    geofenceOptions: geofenceOptionsProps || geofenceInProgressOptions,
  };

  let geofenceInProgressJSX = null;

  switch (geofenceInProgress.type) {
    case 'circle':
      geofenceInProgressJSX = (
        <GeofenceCircle
          updateGeofence={updateGeofence}
          geofence={geofenceInProgress}
          editGeofence={editGeofenceInProgress}
          onDblClick={handleDoubleClick}
          {...geofenceProps}
          visible
        />
      );
      break;
    default:
      break;
  }
  return geofenceInProgressJSX;
};

GeofenceInProgress.propTypes = {
  editGeofenceInProgress: PropTypes.bool,
  editNode: PropTypes.string,
  geofenceInProgress: PropTypes.object,
  geofenceOptionsProps: PropTypes.object,

  updateGeofence: PropTypes.func.isRequired,
};

export default GeofenceInProgress;
