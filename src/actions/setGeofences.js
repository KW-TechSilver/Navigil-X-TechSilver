import { SET_GEOFENCES } from 'constants/ActionTypes';

export const setGeofences = geofences => ({
  type: SET_GEOFENCES,
  geofences,
});
