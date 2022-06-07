import { SET_IS_USER_GEOLOC_ON } from 'constants/ActionTypes';

export const setIsUserGeolocOn = isUserGeolocOn => ({
  type: SET_IS_USER_GEOLOC_ON,
  isUserGeolocOn,
});
