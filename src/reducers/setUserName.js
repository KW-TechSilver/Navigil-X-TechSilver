import { SET_USER_NAME } from 'constants/ActionTypes';

export default function userName(state = null, action) {
  switch (action.type) {
    case SET_USER_NAME: {
      return action.email;
    }
    default: {
      return state;
    }
  }
}
