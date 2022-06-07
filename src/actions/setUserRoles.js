import { SET_USER_ROLES } from 'constants/ActionTypes.js';

export const setuserRoles = userRoles => ({
  type: SET_USER_ROLES,
  userRoles,
});
