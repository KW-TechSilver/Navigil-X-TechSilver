import { SET_IS_FILTERS_AUTO_REFRESHING } from 'constants/ActionTypes';

export const setIsFiltersAutoRefreshing = isFiltersAutoRefreshing => ({
  type: SET_IS_FILTERS_AUTO_REFRESHING,
  isFiltersAutoRefreshing,
});
