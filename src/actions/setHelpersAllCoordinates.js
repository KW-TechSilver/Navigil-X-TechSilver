import { SET_HELPERS_ALL_COORDINATES } from 'constants/ActionTypes';

export const setHelpersAllCoordinates = helpersAllCoordinates => ({
  type: SET_HELPERS_ALL_COORDINATES,
  helpersAllCoordinates,
});

export const clearHelpersAllCoordinates = () => ({
  type: SET_HELPERS_ALL_COORDINATES,
  helpersAllCoordinates: {},
});
