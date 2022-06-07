import { SET_GEOFENCE_EDIT_NODE_MODE } from 'constants/ActionTypes';

export default function setGeofenceEditNodeMode(state = null, action) {
  switch (action.type) {
    case SET_GEOFENCE_EDIT_NODE_MODE: {
      return action.geofenceEditNodeMode;
    }
    default: {
      return state;
    }
  }
}
