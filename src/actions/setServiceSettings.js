import { SET_SERVICE_SETTINGS } from 'constants/ActionTypes';

export const setServiceSettings = serviceSettings => ({
  type: SET_SERVICE_SETTINGS,
  serviceSettings,
});
