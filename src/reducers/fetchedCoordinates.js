import { SET_FETCHED_COORDINATES } from 'constants/ActionTypes';

export default function fetchedCoordinates(state = [], action) {
  switch (action.type) {
    case SET_FETCHED_COORDINATES: {
      return action.fetchedCoordinates;
    }
    default: {
      return state;
    }
  }
}
