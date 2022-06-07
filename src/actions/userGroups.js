import {
  SET_USER_GROUPS_DATA,
  SET_GROUP_LIST_CHECKED,
  SET_CHECKED_GROUP_DATA,
} from 'constants/ActionTypes';

export const setUserGroupsData = userGroupData => ({
  type: SET_USER_GROUPS_DATA,
  userGroupData,
});

export const setGroupListChecked = status => ({
  type: SET_GROUP_LIST_CHECKED,
  status,
});

export const setCheckedGroupData = checkedGroupData => ({
  type: SET_CHECKED_GROUP_DATA,
  checkedGroupData,
});
