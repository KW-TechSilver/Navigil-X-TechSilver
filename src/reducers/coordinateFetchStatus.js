import { SET_COORDINATE_FETCH_STATUS } from 'constants/ActionTypes';

export default function coordinateFetchStatus(state = null, action) {
  switch (action.type) {
    case SET_COORDINATE_FETCH_STATUS: {
      return action.coordinateFetchStatus;
    }
    default: {
      return state;
    }
  }
}
