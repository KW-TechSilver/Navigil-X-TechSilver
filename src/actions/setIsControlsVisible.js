import { SET_IS_CONTROLS_VISIBLE } from 'constants/ActionTypes';

export const setIsControlsVisible = isControlsVisible => ({
  type: SET_IS_CONTROLS_VISIBLE,
  isControlsVisible,
});
