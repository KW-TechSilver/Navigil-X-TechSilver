import { SET_CLICKED_COORDINATES } from 'constants/ActionTypes';

export const setClickedCoordinates = clickedCoordinates => ({
  type: SET_CLICKED_COORDINATES,
  clickedCoordinates,
});
