import { FETCH_COORDINATES } from 'constants/ActionTypes';

export default function helpersCoordinates(state = [], action) {
  switch (action.type) {
    case FETCH_COORDINATES: {
      return action.helpers;
    }
    default: {
      return state;
    }
  }
}
