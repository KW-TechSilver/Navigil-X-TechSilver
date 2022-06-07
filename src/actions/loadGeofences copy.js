import { SET_GEOFENCES } from 'constants/ActionTypes';
import { getGeofencesFromBackend } from 'rafaelComponents/MapTool/Utils/Utils';
import { getGeofences } from 'api/MiddlewareAPI';

export const loadGeofences = serialNumber => async dispatch => {
  const geofences = await getGeofencesFromBackend({ serialNumber, getGeofences });
  dispatch({
    type: SET_GEOFENCES,
    geofences,
  });
};
