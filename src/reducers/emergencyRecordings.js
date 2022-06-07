import { FETCH_EMERGENCY_RECORDINGS } from 'constants/ActionTypes';

export default function emegencyRecordings(state = [], action) {
  switch (action.type) {
    case FETCH_EMERGENCY_RECORDINGS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
