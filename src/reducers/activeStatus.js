import { FETCH_ACTIVE_STATUS } from 'constants/ActionTypes';

export default function activeStatus(state = null, action) {
  switch (action.type) {
    case FETCH_ACTIVE_STATUS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
