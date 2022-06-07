import { SET_FETCHED_HELPERS_COORDINATES } from 'constants/ActionTypes';

export default function fetchedHelpersCoordinates(state = [], action) {
  switch (action.type) {
    case SET_FETCHED_HELPERS_COORDINATES: {
      return action.fetchedHelpersCoordinates;
    }
    default: {
      return state;
    }
  }
}
