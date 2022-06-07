import { SET_COMPANY } from 'constants/ActionTypes';

export default function company(state = null, action) {
  switch (action.type) {
    case SET_COMPANY: {
      return action.company;
    }
    default: {
      return state;
    }
  }
}
