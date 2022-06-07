import { SET_GEOFENCE_IN_PROGRESS } from 'constants/ActionTypes';

export default function geofenceInProgress(state = null, action) {
  switch (action.type) {
    case SET_GEOFENCE_IN_PROGRESS: {
      return action.geofenceInProgress;
    }
    default: {
      return state;
    }
  }
}
