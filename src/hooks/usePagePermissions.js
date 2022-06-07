import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useDevice from 'hooks/useDevice';

const usePagePermissions = page => {
  const [{ permissions: { [page]: devicePermissions } = {} }] = useDevice();
  const { settings: { [page]: companyPermissions } = {} } = useSelector(store => store.userCompany);
  const permissions = useMemo(() => {
    const _permissions = {};
    const keySet = new Set([
      ...Object.keys(devicePermissions || {}),
      ...Object.keys(companyPermissions || {}),
    ]);
    keySet.forEach(key => {
      const deviceValue = devicePermissions?.[key] !== false;
      const companyValue = companyPermissions?.[key] !== false;
      _permissions[key] = companyValue && deviceValue;
    });
    return _permissions;
  }, [devicePermissions, companyPermissions]);

  return permissions;
};

export default usePagePermissions;
