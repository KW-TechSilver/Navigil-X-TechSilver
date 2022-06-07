import { LOAD_COMPANY_LIST } from 'constants/ActionTypes';

export default function companyList(state = [], action) {
  switch (action.type) {
    case LOAD_COMPANY_LIST: {
      return action.companyList;
    }
    default: {
      return state;
    }
  }
}
