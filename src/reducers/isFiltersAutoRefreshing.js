import { SET_IS_FILTERS_AUTO_REFRESHING } from 'constants/ActionTypes';

export default function setIsFiltersAutoRefreshing(state = false, action) {
  switch (action.type) {
    case SET_IS_FILTERS_AUTO_REFRESHING: {
      return action.isFiltersAutoRefreshing;
    }
    default: {
      return state;
    }
  }
}
