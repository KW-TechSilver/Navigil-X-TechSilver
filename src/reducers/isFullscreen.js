import { SET_IS_FULLSCREEN } from 'constants/ActionTypes';

export default function setIsFullscreen(state = false, action) {
  switch (action.type) {
    case SET_IS_FULLSCREEN: {
      return action.isFullscreen;
    }
    default: {
      return state;
    }
  }
}
