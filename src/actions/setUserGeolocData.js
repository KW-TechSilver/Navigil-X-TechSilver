import { SET_USER_GEOLOC_DATA } from 'constants/ActionTypes';

export const setUserGeolocData = userGeolocData => ({
  type: SET_USER_GEOLOC_DATA,
  userGeolocData,
});
