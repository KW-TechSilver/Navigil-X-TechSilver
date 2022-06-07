import { SET_IS_SIGNED_IN } from 'constants/ActionTypes';

export const setIsSignedIn = isSignedIn => ({
  type: SET_IS_SIGNED_IN,
  isSignedIn,
});
