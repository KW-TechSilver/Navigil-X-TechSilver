import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner, hideSpinner } from 'actions';

const FORCE_HIDE_TIMEOUT = 30000; // force hide to prevent spinning forever

const newId = () =>
  `${new Date().getTime()}${_.times(8, () => _.random(35).toString(36)).join('')}`;

export default function useSpinner() {
  const dispatch = useDispatch();

  const hide = useCallback(id => dispatch(hideSpinner(id)), [dispatch]);

  const show = useCallback(() => {
    const id = newId();
    dispatch(showSpinner(id));
    setTimeout(() => hide(id), FORCE_HIDE_TIMEOUT);
    return id;
  }, [dispatch, hide]);

  const withSpinner = useCallback(
    async fn => {
      const id = show();
      try {
        return await fn();
      } finally {
        hide(id);
      }
    },
    [show, hide]
  );

  return useMemo(() => ({ show, hide, withSpinner }), [show, hide, withSpinner]);
}
