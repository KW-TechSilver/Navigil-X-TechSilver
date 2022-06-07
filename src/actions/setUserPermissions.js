import { SET_USER_PERMISSIONS } from 'constants/ActionTypes';
import { getUserPermissions, getCompanyData } from 'api/MiddlewareAPI';

export const setUserPermissions = (fetchPermissions = true) => async (dispatch, getStore) => {
  let { userData, userPermissions } = getStore();
  if (fetchPermissions) {
    userPermissions = await getUserPermissions();
  } else {
    const { companyId } = userData || {};
    if (companyId) {
      const {
        body: [{ settings }],
      } = await getCompanyData(companyId);
      Object.keys(userPermissions).forEach(page => {
        userPermissions[page] =
          settings?.[page] === undefined || settings?.[page] ? userPermissions[page] : false;
      });
    }
  }

  dispatch({
    type: SET_USER_PERMISSIONS,
    userPermissions,
  });
};
