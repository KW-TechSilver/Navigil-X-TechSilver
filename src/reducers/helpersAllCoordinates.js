import { SET_HELPERS_ALL_COORDINATES } from 'constants/ActionTypes';

export default function helpersAllCoordinates(state = {}, action) {
  switch (action.type) {
    case SET_HELPERS_ALL_COORDINATES: {
      return action.helpersAllCoordinates;
    }
    default: {
      return state;
    }
  }
}
