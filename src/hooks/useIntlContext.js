import { useContext } from 'react';
import IntlContext from 'context/IntlContext';

const useIntlContext = () => {
  const intlContext = useContext(IntlContext);
  return intlContext;
};

export default useIntlContext;
