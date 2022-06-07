import { SET_MARKER_ANIMATION_AND_CIRCLE } from 'constants/ActionTypes';

const DEFAULT = {
  animateMarker: null,
  bounceTimer: null,
  showCircleIndex: null,
};

export default function markerAnimationAndCircle(state = DEFAULT, action) {
  switch (action.type) {
    case SET_MARKER_ANIMATION_AND_CIRCLE: {
      clearTimeout(state.bounceTimer);
      return { ...state, ...action.payload };
    }
    default: {
      return state;
    }
  }
}
