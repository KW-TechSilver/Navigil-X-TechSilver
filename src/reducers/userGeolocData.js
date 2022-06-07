import { SET_USER_GEOLOC_DATA } from 'constants/ActionTypes';

const EMPTY_DATA = {
  cognitoSub: null,
  coords: null,
  intervalId: null,
  name: null,
  phone: null,
};

export default function userGeolocData(state = EMPTY_DATA, action) {
  switch (action.type) {
    case SET_USER_GEOLOC_DATA: {
      return action.userGeolocData;
    }
    default: {
      return state;
    }
  }
}
