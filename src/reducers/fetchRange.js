import { SET_FETCH_RANGE, RESET_FETCH_RANGE } from 'constants/ActionTypes';
import { startOfDay, endOfDay, subMonths, addMonths } from 'date-fns';

const RESET_RANGE = [startOfDay(new Date(0)), endOfDay(addMonths(new Date(), 1))];
const RESET_CHART_RANGE = [
  startOfDay(subMonths(new Date(), 1)),
  endOfDay(addMonths(new Date(), 1)),
];

export default function fetchRange(
  state = { default: RESET_RANGE, charts: RESET_CHART_RANGE },
  action
) {
  switch (action.type) {
    case SET_FETCH_RANGE: {
      return {
        charts: [
          new Date(action.charts?.start ?? state.charts[0]),
          new Date(action.charts?.end ?? state.charts[1]),
        ],
        default: [
          new Date(action.start ?? state.default[0]),
          new Date(action.end ?? state.default[1]),
        ],
      };
    }
    case RESET_FETCH_RANGE: {
      return { ...state, default: RESET_RANGE, charts: RESET_CHART_RANGE };
    }

    default: {
      return state;
    }
  }
}
