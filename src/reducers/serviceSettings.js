import { SET_SERVICE_SETTINGS } from 'constants/ActionTypes';

export default function SERVICE_SETTINGS(state = {}, action) {
  switch (action.type) {
    case SET_SERVICE_SETTINGS: {
      return action.serviceSettings;
    }
    default: {
      return state;
    }
  }
}
