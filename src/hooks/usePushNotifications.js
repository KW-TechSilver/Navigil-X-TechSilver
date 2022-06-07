import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMobilePushToken } from 'api/MiddlewareAPI';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from 'core/notifications';
import { setSerialNumber } from 'actions';

export default function usePushNotifications(navRef) {
  const dispatch = useDispatch();
  const responseListener = useRef();

  const { userData: { id } = {} } = useSelector(store => ({
    userData: store.userData,
  }));

  useEffect(() => {
    if (id) {
      registerForPushNotificationsAsync().then(response => {
        if (!response) {
          return;
        }
        updateMobilePushToken({ accountId: id, pushToken: response.data, os: response.type });
      });
    }
  }, [id]);

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(event => {
      if (navRef.current) {
        navRef.current.navigate('Dashboard');
      }
      const serialNumber = event?.notification?.request?.content?.data?.serialNumber;
      if (serialNumber) {
        dispatch(setSerialNumber(serialNumber));
      }
    });

    // TODO: Implement addPushTokenListener to handle token rotation

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [navRef, dispatch]);
}
