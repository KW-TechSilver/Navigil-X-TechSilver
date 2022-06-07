import { SET_IS_SIGNED_IN } from 'constants/ActionTypes';

export default function isSignedIn(state = true, action) {
  switch (action.type) {
    case SET_IS_SIGNED_IN: {
      return action.isSignedIn;
    }
    default: {
      return state;
    }
  }
}
