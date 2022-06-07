import { SET_IS_USER_GEOLOC_ON, TOGGLE_IS_USER_GEOLOC_ON } from 'constants/ActionTypes';

export default function isuserGeolocOn(state = false, action) {
  switch (action.type) {
    case SET_IS_USER_GEOLOC_ON: {
      return action.isUserGeolocOn;
    }
    case TOGGLE_IS_USER_GEOLOC_ON: {
      return !state;
    }
    default: {
      return state;
    }
  }
}
