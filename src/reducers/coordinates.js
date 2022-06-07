import { FETCH_COORDINATES } from 'constants/ActionTypes';

export default function coordinates(state = [], action) {
  switch (action.type) {
    case FETCH_COORDINATES: {
      return action.coordinates;
    }
    default: {
      return state;
    }
  }
}
