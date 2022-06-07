import { useMemo } from 'react';
import { useSelector } from 'react-redux';
// Checks if user is in any of the given user groups
// if no groups given, returns false
// RETURN VALUE: array = [booleanInAnyOfGroups, arrayOfMatchingGroups]

const useInUserGroups = (...groups) => {
  const userRoles = useSelector(store => store.userRoles);
  const inGroups = useMemo(() => groups.filter(group => userRoles?.includes(group)), [
    userRoles,
    groups,
  ]);
  return [inGroups.length > 0, userRoles];
};

export default useInUserGroups;
