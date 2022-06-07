import { SET_MARKER_ANIMATION_AND_CIRCLE } from 'constants/ActionTypes';

export const setMarkerAnimationAndCircle = payload => dispatch => {
  dispatch({
    type: SET_MARKER_ANIMATION_AND_CIRCLE,
    payload,
  });
};
