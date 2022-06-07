import { SET_IS_EDITING_GEOFENCE } from 'constants/ActionTypes';

export const setIsEditingGeofence = isEditingGeofence => ({
  type: SET_IS_EDITING_GEOFENCE,
  isEditingGeofence,
});
