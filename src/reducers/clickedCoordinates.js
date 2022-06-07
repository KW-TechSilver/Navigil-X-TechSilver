import { SET_CLICKED_COORDINATES } from 'constants/ActionTypes';

export default function clickedCoordinates(state = null, action) {
  switch (action.type) {
    case SET_CLICKED_COORDINATES: {
      return action.clickedCoordinates;
    }
    default: {
      return state;
    }
  }
}
