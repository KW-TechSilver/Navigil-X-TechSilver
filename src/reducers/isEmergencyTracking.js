import { SET_IS_EMERGENCY_TRACKING } from 'constants/ActionTypes';

export default function isEmergencyTracking(state = false, action) {
  switch (action.type) {
    case SET_IS_EMERGENCY_TRACKING: {
      return action.isEmergencyTracking;
    }
    default: {
      return state;
    }
  }
}
