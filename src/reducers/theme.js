import { SET_THEME } from 'constants/ActionTypes';

export default function setTheme(state = 'Default', action) {
  switch (action.type) {
    case SET_THEME: {
      return action.theme;
    }
    default: {
      return state;
    }
  }
}
