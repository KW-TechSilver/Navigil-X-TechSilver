import { SET_IS_EDITING_GEOFENCE } from 'constants/ActionTypes';

export default function isEditingGeofence(state = false, action) {
  switch (action.type) {
    case SET_IS_EDITING_GEOFENCE: {
      return action.isEditingGeofence;
    }
    default: {
      return state;
    }
  }
}
