import { SET_FETCH_RANGE, RESET_FETCH_RANGE } from 'constants/ActionTypes';

export const setFetchEnd = end => ({ type: SET_FETCH_RANGE, end });
export const setFetchStart = start => ({ type: SET_FETCH_RANGE, start });
export const setChartFetchStart = start => ({ type: SET_FETCH_RANGE, charts: { start } });
export const setChartFetchEnd = end => ({ type: SET_FETCH_RANGE, charts: { end } });
export const setFetchRange = ([start, end]) => ({ type: SET_FETCH_RANGE, start, end });
export const setChartFetchRange = ([start, end]) => ({
  type: SET_FETCH_RANGE,
  charts: { start, end },
});
export const resetFetchRanges = () => ({ type: RESET_FETCH_RANGE });
