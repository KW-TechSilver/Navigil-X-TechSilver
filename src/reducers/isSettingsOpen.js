import { SET_IS_SETTINGS_OPEN, TOGGLE_SETTINGS_OPEN } from 'constants/ActionTypes';

export default function isSettingsOpen(state = false, action) {
  switch (action.type) {
    case SET_IS_SETTINGS_OPEN: {
      return action.isSettingsOpen;
    }
    case TOGGLE_SETTINGS_OPEN: {
      return !state;
    }
    default: {
      return state;
    }
  }
}
