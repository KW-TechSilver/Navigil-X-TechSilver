import { SET_IS_CONTROLS_VISIBLE } from 'constants/ActionTypes';

export default function isControlsVisible(state = true, action) {
  switch (action.type) {
    case SET_IS_CONTROLS_VISIBLE: {
      return action.isControlsVisible;
    }
    default: {
      return state;
    }
  }
}
