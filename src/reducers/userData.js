import { SET_USER_DATA } from 'constants/ActionTypes';

export default function setUserData(state = [], action) {
  switch (action.type) {
    case SET_USER_DATA: {
      return action.userData;
    }
    default: {
      return state;
    }
  }
}
