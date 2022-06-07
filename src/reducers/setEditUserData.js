import { EDIT_USER_DATA } from 'constants/ActionTypes';

export const initialState = {
  userData: [],
};
export default function setEditUserData(state = initialState, action) {
  switch (action.type) {
    case EDIT_USER_DATA: {
      return action.userData;
    }
    default: {
      return state;
    }
  }
}
