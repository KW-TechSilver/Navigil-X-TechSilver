import { SET_CHARTS_FILTER } from 'constants/ActionTypes';

export default function setChartsFilter(state = [], action) {
  switch (action.type) {
    case SET_CHARTS_FILTER: {
      return action.chartsFilter;
    }
    default: {
      return state;
    }
  }
}
