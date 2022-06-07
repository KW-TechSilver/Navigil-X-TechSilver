import { SET_USER_PERMISSIONS } from 'constants/ActionTypes';

export default function setUserPermissions(state = {}, action) {
  switch (action.type) {
    case SET_USER_PERMISSIONS: {
      return action.userPermissions;
    }
    default: {
      return state;
    }
  }
}
