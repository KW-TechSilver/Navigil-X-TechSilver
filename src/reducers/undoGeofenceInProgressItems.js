import { SET_UNDO_GEOFENCE_IN_PROGRESS_ITEMS } from 'constants/ActionTypes';

export default function undoGeofenceInProgressItems(state = [], action) {
  switch (action.type) {
    case SET_UNDO_GEOFENCE_IN_PROGRESS_ITEMS: {
      return action.undoGeofenceInProgressItems;
    }
    default: {
      return state;
    }
  }
}
