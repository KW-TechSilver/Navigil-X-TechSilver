import { SET_GEOFENCE_IN_PROGRESS } from 'constants/ActionTypes';

export const setGeofenceInProgress = geofenceInProgress => ({
  type: SET_GEOFENCE_IN_PROGRESS,
  geofenceInProgress,
});
