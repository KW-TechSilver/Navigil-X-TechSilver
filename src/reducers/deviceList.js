import { LOAD_DEVICE_LIST, EMPTY_DEVICE_LIST } from 'constants/ActionTypes';

export default function deviceList(state = null, action) {
  switch (action.type) {
    case LOAD_DEVICE_LIST: {
      return action.deviceDataList;
    }
    case EMPTY_DEVICE_LIST: {
      return action.deviceData;
    }
    default: {
      return state;
    }
  }
}
