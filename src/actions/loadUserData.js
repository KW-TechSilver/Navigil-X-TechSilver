import { SET_USER_DATA, SET_USER_PERMISSIONS, SET_SPINNER } from 'constants/ActionTypes';
import { getUserByEmail } from 'api/MiddlewareAPI';

export const loadUserData = userName => async (dispatch, getStore) => {
  try {
    dispatch({ type: SET_SPINNER, id: 'userData', show: true });
    if (userName) {
      const userData = await getUserByEmail(userName);
      let { userPermissions } = getStore();
      if (userData.role === 'Relative' && !userData.canAddSameLevel) {
        userPermissions = { ...userPermissions, users: false };
      }
      dispatch({
        type: SET_USER_PERMISSIONS,
        userPermissions,
      });
      dispatch({
        type: SET_USER_DATA,
        userData,
      });
    }
  } catch (error) {
    console.log('getUserGroups error', getUserByEmail);
  }
};
