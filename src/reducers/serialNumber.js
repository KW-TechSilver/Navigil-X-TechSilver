import { SET_SERIAL_NUMBER } from 'constants/ActionTypes';

export default function serialNumber(state = null, action) {
  switch (action.type) {
    case SET_SERIAL_NUMBER: {
      return action.serialNumber;
    }
    default: {
      return state;
    }
  }
}
