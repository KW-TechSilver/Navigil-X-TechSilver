import { SET_IS_CONTROLS_VISIBLE } from 'constants/ActionTypes';

export const showControls = () => ({
  type: SET_IS_CONTROLS_VISIBLE,
  isControlsVisible: true,
});
