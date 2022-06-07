import { SET_BASE_DATA } from 'constants/ActionTypes';

const DEFAULT_CENTER = { lat: 60.188209, lng: 24.940707 };
export default function baseData(state = { 'default-location': DEFAULT_CENTER }, action) {
  switch (action.type) {
    case SET_BASE_DATA: {
      return action.baseData;
    }
    default: {
      return state;
    }
  }
}
