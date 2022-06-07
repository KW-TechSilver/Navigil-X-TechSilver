import { SET_CHARTS_FILTER } from 'constants/ActionTypes';

export const setChartsFilter = chartsFilter => ({
  type: SET_CHARTS_FILTER,
  chartsFilter,
});
