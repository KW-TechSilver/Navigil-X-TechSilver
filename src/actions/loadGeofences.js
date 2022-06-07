import { SET_GEOFENCES } from 'constants/ActionTypes';
import { getGeofences } from 'api/MiddlewareAPI';
import { getGeofencesFromBackend } from 'rafaelComponents/MapTool/Utils/Utils';

export const loadGeofences = serialNumber => async dispatch => {
  const geofences = await getGeofencesFromBackend({
    serialNumber,
    getGeofences,
  });
  dispatch({
    type: SET_GEOFENCES,
    geofences,
  });
};
