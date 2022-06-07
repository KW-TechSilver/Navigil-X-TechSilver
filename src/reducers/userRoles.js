import { SET_USER_ROLES } from 'constants/ActionTypes';

export default function setUserRoles(state = [], action) {
  switch (action.type) {
    case SET_USER_ROLES: {
      return action.userRoles;
    }
    default: {
      return state;
    }
  }
}
