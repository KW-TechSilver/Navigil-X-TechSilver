import { SIGN_IN, SIGN_OUT } from 'constants/ActionTypes';

export default function userToken(state = null, action) {
  switch (action.type) {
    case SIGN_IN: {
      return action.userToken;
    }
    case SIGN_OUT: {
      return null;
    }
    default: {
      return state;
    }
  }
}
