import { SET_USER_NAME } from 'constants/ActionTypes';

export const userName = email => ({
  type: SET_USER_NAME,
  email,
});
