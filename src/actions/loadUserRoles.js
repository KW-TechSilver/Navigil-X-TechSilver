import { SET_USER_ROLES, EMPTY_USER_ROLES } from 'constants/ActionTypes';
import { getUserGroups } from 'api/MiddlewareAPI';

export const loadUserRoles = () => async dispatch => {
  try {
    const userRoles = await getUserGroups();
    dispatch({
      type: SET_USER_ROLES,
      userRoles,
    });
  } catch (error) {
    console.log('getUserGroups error', getUserGroups);
  }
};

export const emptyUserRoles = () => ({
  type: EMPTY_USER_ROLES,
  userRoles: [],
});
