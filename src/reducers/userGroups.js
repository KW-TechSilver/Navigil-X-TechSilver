import {
  SET_USER_GROUPS_DATA,
  SET_GROUP_LIST_CHECKED,
  SET_CHECKED_GROUP_DATA,
} from 'constants/ActionTypes';

const initialState = {
  groupData: null,
  checkedGroupData: null,
};

function userGroups(state = initialState, action) {
  switch (action.type) {
    case SET_USER_GROUPS_DATA:
      return {
        ...state,
        groupData: action.userGroupData,
      };
    case SET_GROUP_LIST_CHECKED:
      return {
        ...state,
        status: action.status,
      };
    case SET_CHECKED_GROUP_DATA:
      return {
        ...state,
        checkedGroupData: action.checkedGroupData,
      };

    default: {
      return state;
    }
  }
}

export default userGroups;
