import { SET_UNDO_GEOFENCE_IN_PROGRESS_ITEMS } from 'constants/ActionTypes';

export const setUndoGeofenceInProgressItems = undoGeofenceInProgressItems => ({
  type: SET_UNDO_GEOFENCE_IN_PROGRESS_ITEMS,
  undoGeofenceInProgressItems,
});
