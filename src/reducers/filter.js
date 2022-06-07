import { SET_FILTER } from 'constants/ActionTypes';
import { DEFAULT_FILTER } from './settings/settings';

export default function filter(state = DEFAULT_FILTER, action) {
  switch (action.type) {
    case SET_FILTER: {
      return action.filter;
    }
    default: {
      return state;
    }
  }
}
