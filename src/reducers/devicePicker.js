import { SET_SERIAL_NUMBER, SET_DEVICE_PICKER_OPEN } from 'constants/ActionTypes';

const DEFAULT_STATE = { open: false };

export default function emegencyRecordings(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case SET_DEVICE_PICKER_OPEN: {
      return { ...state, open: action.payload };
    }
    case SET_SERIAL_NUMBER: {
      return { ...state, open: false };
    }
    default: {
      return state;
    }
  }
}
