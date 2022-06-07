import { SET_IS_CONTROLS_VISIBLE } from 'constants/ActionTypes';

export const hideControls = () => ({
  type: SET_IS_CONTROLS_VISIBLE,
  isControlsVisible: false,
});
