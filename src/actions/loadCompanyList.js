import { LOAD_COMPANY_LIST } from 'constants/ActionTypes';
import { getAllCompaniesData } from 'api/MiddlewareAPI';

export const loadCompanyList = () => async dispatch => {
  const response = await getAllCompaniesData();
  if (response) {
    const companyList = response.map(obj => {
      const companyObj = { name: obj.name, id: obj.id };
      return companyObj;
    });
    dispatch({
      type: LOAD_COMPANY_LIST,
      companyList,
    });
  }
};
