import { EDIT_USER_DATA } from 'constants/ActionTypes.js';

export const setEditUserData = userData => ({
  type: EDIT_USER_DATA,
  userData,
});
