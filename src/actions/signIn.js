import { SIGN_IN, SIGN_OUT } from 'constants/ActionTypes';

export const signIn = user => ({
  type: SIGN_IN,
  userToken: user.signInUserSession.accessToken.jwtToken,
});

export const signOut = () => ({ type: SIGN_OUT });
