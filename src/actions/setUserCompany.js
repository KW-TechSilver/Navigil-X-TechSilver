import { SET_USER_COMPANY } from 'constants/ActionTypes';

export const setUserCompany = userCompany => ({
  type: SET_USER_COMPANY,
  userCompany,
});
