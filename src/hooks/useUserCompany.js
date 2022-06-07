import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserCompany } from 'actions';
import { getCompanyData } from 'api/MiddlewareAPI';
import useMiddlewareAPI from 'hooks/useMiddlewareAPI';

const useUserCompany = () => {
  const dispatch = useDispatch();
  const { companyId } = useSelector(store => store.userData);

  const [company, fetchCompany] = useMiddlewareAPI(
    {
      name: 'useUserCompany',
      function: [getCompanyData, companyId],
      blockAutoFetch: !companyId,
    },
    [companyId]
  );

  useEffect(() => {
    dispatch(setUserCompany(company?.[0] || {}));
  }, [company, dispatch, fetchCompany]);
  return [company?.[0] || null, fetchCompany];

  // const fetchCompany = useCallback(async () => {
  //   const response = await getCompanyData(companyId);
  //   console.log('response', response);
  //   if (response) {
  //     dispatch(setUserCompany(response?.[0]));
  //   } else {
  //     dispatch(setUserCompany({}));
  //   }
  // }, [companyId, dispatch]);

  // useEffect(() => {
  //   fetchCompany();
  // }, [fetchCompany]);
  // return fetchCompany;
};

export default useUserCompany;
