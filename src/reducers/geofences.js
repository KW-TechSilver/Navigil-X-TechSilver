import { SET_GEOFENCES } from 'constants/ActionTypes';

export default function geofences(state = {}, action) {
  switch (action.type) {
    case SET_GEOFENCES: {
      return action.geofences;
    }
    default: {
      return state;
    }
  }
}
