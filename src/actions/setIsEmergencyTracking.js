import { SET_IS_EMERGENCY_TRACKING } from 'constants/ActionTypes';

export const setIsEmergencyTracking = isEmergencyTracking => ({
  type: SET_IS_EMERGENCY_TRACKING,
  isEmergencyTracking,
});
