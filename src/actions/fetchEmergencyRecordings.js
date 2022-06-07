import { getEmergencyRecordings } from 'api/MiddlewareAPI';
import { FETCH_EMERGENCY_RECORDINGS, SET_SPINNER } from 'constants/ActionTypes';

export const fetchEmergencyRecordings = (
  deviceId,
  fetchRange = [new Date(0), new Date()]
) => async dispatch => {
  dispatch({ type: SET_SPINNER, id: 'emergencyRecordings', show: true });
  const payload = await getEmergencyRecordings({ deviceId, fetchRange });
  dispatch({ type: FETCH_EMERGENCY_RECORDINGS, payload });
};
