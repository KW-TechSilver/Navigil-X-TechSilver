import _ from 'lodash';
import { FETCH_COORDINATES } from 'constants/ActionTypes';

export default function targetLastKnownCoords(state = null, action) {
  switch (action.type) {
    case FETCH_COORDINATES: {
      return _.last(action.coordinates) ?? null;
    }
    default: {
      return state;
    }
  }
}
