import { SET_SPINNER } from 'constants/ActionTypes';

export const showSpinner = id => ({ type: SET_SPINNER, id, show: true });
export const hideSpinner = id => ({ type: SET_SPINNER, id, show: false });
