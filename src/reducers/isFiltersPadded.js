import { SET_IS_FILTERS_PADDED } from 'constants/ActionTypes';

export default function setIsFiltersPadded(state = false, action) {
  switch (action.type) {
    case SET_IS_FILTERS_PADDED: {
      return action.isFiltersPadded;
    }
    default: {
      return state;
    }
  }
}
