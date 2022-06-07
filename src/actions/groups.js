import {
  SET_USER_GROUPS_DATA,
  SET_ADD_GROUP_DATA,
  SET_EDIT_GROUP_DATA,
  SET_CHECKED_USER_GROUPS_DATA,
  SET_GROUP_MODAL,
  GET_COMPANY_PARENT_ID,
} from 'constants/ActionTypes';

export const setUserGroupsData = userGroupData => ({
  type: SET_USER_GROUPS_DATA,
  userGroupData,
});

export const setCheckedUserGroupsData = userGroupData => ({
  type: SET_CHECKED_USER_GROUPS_DATA,
  userGroupData,
});

export const setAddGroupData = addGroupData => ({
  type: SET_ADD_GROUP_DATA,
  addGroupData,
});

export const setEditGroupData = editGroupData => ({
  type: SET_EDIT_GROUP_DATA,
  editGroupData,
});

export const setGroupModal = status => ({
  type: SET_GROUP_MODAL,
  status,
});

export const getCompanyParentId = (nodeId, parentId) => ({
  type: GET_COMPANY_PARENT_ID,
  parentId,
  nodeId,
});
