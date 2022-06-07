import { SET_FETCHED_HELPERS_COORDINATES } from 'constants/ActionTypes';

export const setFetchedHelpersCoordinates = fetchedHelpersCoordinates => ({
  type: SET_FETCHED_HELPERS_COORDINATES,
  fetchedHelpersCoordinates,
});

export const clearFetchedHelpersCoordinates = () => ({
  type: SET_FETCHED_HELPERS_COORDINATES,
  fetchedHelpersCoordinates: [],
});
