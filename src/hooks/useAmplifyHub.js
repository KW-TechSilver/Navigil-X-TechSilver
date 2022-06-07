import { Hub } from 'aws-amplify';
import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from 'actions';
import { LoginContext } from 'screens/LoginContext';

const useAmplifyHub = () => {
  const dispatch = useDispatch();
  const { setStoredToken } = useContext(LoginContext);

  // https://docs.amplify.aws/lib/auth/auth-events/q/platform/js/
  useEffect(() => {
    const listener = data => {
      switch (data.payload.event) {
        case 'signOut':
          console.log('useAmplifyHub signOut');
          dispatch(signOut());
          setStoredToken({});
        default:
      }
    };

    Hub.listen('auth', listener);
  }, [dispatch, setStoredToken]);
};

export default useAmplifyHub;
