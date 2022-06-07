import { TOGGLE_DATE_PICKER } from 'constants/ActionTypes';

export default function toggles(state = { datePicker: false }, action) {
  switch (action.type) {
    case TOGGLE_DATE_PICKER: {
      return {
        ...state,
        datePicker: action.payload ?? !state.datePicker,
      };
    }
    default: {
      return state;
    }
  }
}
