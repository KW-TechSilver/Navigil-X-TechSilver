import { SET_USER_COMPANY } from 'constants/ActionTypes';

export default function setUserCompany(state = {}, action) {
  switch (action.type) {
    case SET_USER_COMPANY: {
      return action.userCompany;
    }
    default: {
      return state;
    }
  }
}
