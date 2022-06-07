import { SET_IS_FETCHING_COORDINATES } from 'constants/ActionTypes';

export default function isFetchingCoordinates(state = false, action) {
  switch (action.type) {
    case SET_IS_FETCHING_COORDINATES: {
      return action.isFetchingCoordinates;
    }
    default: {
      return state;
    }
  }
}
