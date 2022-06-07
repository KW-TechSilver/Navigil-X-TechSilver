import { SET_RESET_SLIDER } from 'constants/ActionTypes';

export default function resetSlider(state = false, action) {
  switch (action.type) {
    case SET_RESET_SLIDER: {
      return action.resetSlider;
    }
    default: {
      return state;
    }
  }
}
