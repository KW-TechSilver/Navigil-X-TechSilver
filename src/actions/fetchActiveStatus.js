import { getActiveStatus } from 'api/MiddlewareAPI';
import { FETCH_ACTIVE_STATUS, SET_SPINNER } from 'constants/ActionTypes';

export const fetchActiveStatus = deviceId => async dispatch => {
  dispatch({ type: SET_SPINNER, id: 'activeStatus', show: true });
  const payload = await getActiveStatus({ deviceId });
  return dispatch({ type: FETCH_ACTIVE_STATUS, payload });
};
