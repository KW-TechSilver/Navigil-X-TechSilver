import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setUndoGeofenceInProgressItems,
  setGeofenceInProgress,
  setGeofences,
  loadGeofences,
} from 'actions';
import Geofences from './Geofences';
import GeofenceInProgress from './GeofenceInProgress';

const AllGeofences = ({ disableSelect, hide, noFetch }) => {
  const {
    geofences,
    geofenceInProgress,
    isEditingGeofence,
    serialNumber,
    undoGeofenceInProgressItems,
  } = useSelector(store => ({
    isEditingGeofence: store.isEditingGeofence,
    undoGeofenceInProgressItems: store.undoGeofenceInProgressItems,
    geofenceInProgress: store.geofenceInProgress,
    geofences: store.geofences || null,
    serialNumber: store.serialNumber,
  }));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!noFetch && serialNumber) {
      dispatch(loadGeofences(serialNumber));
    }
    return () => dispatch(setGeofences(null));
  }, [serialNumber, dispatch, noFetch]);

  const geofencesArray = Object.values(geofences || {});
  const geofencesFiltered = geofencesArray.filter(
    geofence => !geofenceInProgress || geofence.id !== geofenceInProgress.id
  );

  if (!geofences || hide) return null;

  const updateGeofenceInProgress = newGeofence => {
    const newUndoGeofenceInProgressItems = [...undoGeofenceInProgressItems, geofenceInProgress];
    dispatch(setGeofenceInProgress(newGeofence));
    dispatch(setUndoGeofenceInProgressItems(newUndoGeofenceInProgressItems));
  };

  return (
    <>
      <Geofences geofences={geofencesFiltered} disableSelect={disableSelect} />
      <GeofenceInProgress
        geofenceInProgress={geofenceInProgress}
        updateGeofence={updateGeofenceInProgress}
        {...(isEditingGeofence ? { editGeofenceInProgress: isEditingGeofence } : {})}
      />
    </>
  );
};

export default AllGeofences;
