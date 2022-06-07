import _ from 'lodash';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Modal,
  Button,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserData } from 'actions';
import { actionColor } from 'core/theme';
import useDeviceId from 'hooks/useDeviceId';
import useSpinner from 'hooks/useSpinner';
import useFormatMessage from 'hooks/useFormatMessage';
import SelectDevice from 'components/SelectDevice';
import { updateUserNotifications, getDeviceSettings, saveDeviceSettings } from 'api/MiddlewareAPI';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PrimaryButton from 'shared/components/PrimaryButton';
import AddDeviceNotificationModal from 'shared/components/Notifications/AddDeviceNotificationModal';
import { getNotificationsList } from 'shared/components/Notifications/util';

import SelectDevices from './SelectDevices';

const NotificationsContext = React.createContext({});

const styles = StyleSheet.create({
  row: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsArea: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    marginTop: 0,
  },
  buttonStyle: {
    margin: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
  },
  currentNotifications: {},
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  notificationIconColumn: {
    width: '12%',
    paddingLeft: '1%',
  },
  notificationTypeColumn: {
    width: '38%',
  },
  notificationDetailsColumn: {
    width: '40%',
    paddingLeft: '1%',
  },
  notificationDeleteColumn: {
    width: '10%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: '1%',
  },
});

const NOTIFICATIONS = [
  'sosCallInitiated',
  'sosCallNoAnswer',
  'sosVoiceRecording',
  'batteryLow',
  'batteryEmpty',
  'geofenceOut',
  'geofenceIn',
  'manDown',
  'noMovement',
  'homeBeaconOut',
  'noConnection',
  'noConnectionEnd',
];

const HeaderRow = ({ text }) => (
  <View style={styles.row}>
    <Text style={{ fontSize: 14, maxWidth: '90%' }}>{text}</Text>
  </View>
);

const MobileNotifications = ({
  mobileNotifications: notifications,
  setMobileNotifications: setNotifications,
  userData = {},
  deviceList,
  fetchUser,
}) => {
  const { ucFirst } = useFormatMessage();
  const userNotifications = userData.notifications?.mobile ?? {};
  const userDevices = userData.notifications?.selectedDevices ?? [];

  const setNotification = useCallback(
    (notification, value) => {
      const previous = notifications?.mobile ?? userNotifications;
      setNotifications({ ...notifications, mobile: { ...previous, [notification]: value } });
    },
    [setNotifications, notifications, userNotifications]
  );

  const setDevices = useCallback(
    selectedDevices => {
      setNotifications(_notifications => ({ ..._notifications, selectedDevices }));
    },
    [setNotifications]
  );

  const renderDeviceSelectionArea = () => (
    <>
      <HeaderRow text={ucFirst({ id: 'notifications.devicesToReceiveFrom' })} />
      <View style={styles.settingsArea}>
        <View style={styles.row}>
          <SelectDevices
            value={notifications?.selectedDevices ?? userDevices}
            setValue={setDevices}
          />
        </View>
      </View>
    </>
  );

  return (
    <ScrollView
      contentContainerStyle={{ minHeight: '100%' }}
      nestedScrollEnabled
      refreshControl={<RefreshControl onRefresh={fetchUser} refreshing={false} />}
    >
      <View style={{ marginBottom: 50 }}>
        {deviceList?.length > 1 && renderDeviceSelectionArea()}
        <View style={styles.row}>
          <Text style={{ fontSize: 14, maxWidth: '90%' }}>
            {ucFirst({ id: 'general.notifications' })}
          </Text>
        </View>
        <View style={styles.settingsArea}>
          {NOTIFICATIONS.map(notification => (
            <View style={styles.row} key={notification}>
              <Text style={{ fontSize: 16 }}>
                {ucFirst({ id: `notificationType.${notification}` })}
              </Text>
              <Switch
                value={notifications?.mobile?.[notification] ?? userNotifications?.[notification]}
                onValueChange={value => setNotification(notification, value)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const MobileNotificationsWrapper = () => (
  <NotificationsContext.Consumer>
    {props => <MobileNotifications {...props} />}
  </NotificationsContext.Consumer>
);

const NOTIFICATION_ICON = {
  call: props => <MaterialIcons name='call' {...props} />,
  email: props => <MaterialIcons name='alternate-email' {...props} />,
};

const CurrentNotifications = ({ notifications, deleteNotification }) => {
  const { ucFirst } = useFormatMessage();
  const notificationsList = useMemo(() => getNotificationsList(notifications), [notifications]);

  const getReceiver = notification => {
    if (notification.receiver === 'sosNumber') {
      return ucFirst({ id: 'deviceSettings.sosNumber' });
    }
    return notification.receiver;
  };

  const getType = notification =>
    ucFirst({ id: `notificationType.${notification.notificationType}` });

  const renderNotification = (notification, i) => {
    const Icon = NOTIFICATION_ICON[notification.channel];
    const deleteThis = () => deleteNotification(notification);
    return (
      <View style={styles.notificationRow} key={i}>
        <View style={styles.notificationIconColumn}>
          <Icon style={{ color: actionColor }} size={30} />
        </View>
        <Text style={styles.notificationTypeColumn}>{getType(notification)}</Text>
        <Text style={styles.notificationDetailsColumn}>
          {notification.channel === 'call' && '+'}
          {getReceiver(notification)}
        </Text>
        <View style={styles.notificationDeleteColumn}>
          <TouchableOpacity onPress={deleteThis}>
            <MaterialIcons name='delete' size={25} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.currentNotifications}>
      <View style={styles.settingsArea}>{notificationsList.map(renderNotification)}</View>
    </View>
  );
};

const DeviceNotificationsContent = ({ notifications, setNotifications }) => {
  const { ucFirst } = useFormatMessage();
  const [modalVisible, setModalVisible] = useState(false);
  const addNew = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const deleteNotification = useCallback(
    ({ notificationType, channel, receiver }) =>
      setNotifications(_notifications => ({
        ..._notifications,
        current: {
          ..._notifications.current,
          [notificationType]: {
            ..._notifications.current[notificationType],
            [channel]: _notifications.current[notificationType][channel].filter(
              x => x.receiver !== receiver
            ),
          },
        },
      })),
    [setNotifications]
  );

  return (
    <View style={{ marginBottom: 50 }}>
      <HeaderRow text={ucFirst({ id: 'deviceSettings.currentNotifications' })} />
      <CurrentNotifications notifications={notifications} deleteNotification={deleteNotification} />
      <PrimaryButton onPress={addNew} style={styles.buttonStyle}>
        <Text style={styles.buttonText}>
          {ucFirst({
            id: 'deviceSettings.addNotification',
          })}
        </Text>
      </PrimaryButton>
      <Modal
        animationType='slide'
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <AddDeviceNotificationModal
          closeModal={closeModal}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </Modal>
    </View>
  );
};

const DeviceNotifications = ({
  settings,
  touchedSettings,
  setTouchedSettings,
  fetchSettings,
  ...rest
}) => {
  const deviceId = useDeviceId();
  const notifications = touchedSettings?.notifications ?? settings.notifications;

  const setNotifications = useCallback(
    value => {
      const result = typeof value === 'function' ? value(notifications) : value;
      setTouchedSettings(_touchedSettings => ({
        ..._touchedSettings,
        notifications: { ..._touchedSettings?.notifications, ...result },
      }));
    },
    [setTouchedSettings, notifications]
  );

  return (
    <View>
      <SelectDevice />
      <ScrollView
        refreshControl={<RefreshControl onRefresh={fetchSettings} refreshing={false} />}
        contentContainerStyle={{ minHeight: '100%' }}
        keyboardShouldPersistTaps='handled'
        nestedScrollEnabled
      >
        {deviceId && settings?.notifications && (
          <DeviceNotificationsContent
            notifications={touchedSettings?.notifications ?? settings.notifications}
            setNotifications={setNotifications}
            {...rest}
          />
        )}
      </ScrollView>
    </View>
  );
};

const DeviceNotificationsWrapper = () => (
  <NotificationsContext.Consumer>
    {props => <DeviceNotifications {...props} />}
  </NotificationsContext.Consumer>
);

const Tab = createMaterialTopTabNavigator();

const NotificationsView = () => {
  const { ucFirst } = useFormatMessage();

  return (
    <Tab.Navigator initialRouteName='Device'>
      <Tab.Screen
        name='Mobile'
        component={MobileNotificationsWrapper}
        options={{ tabBarLabel: 'Mobile' }}
      />
      <Tab.Screen
        name='Device'
        component={DeviceNotificationsWrapper}
        options={{ tabBarLabel: ucFirst({ id: 'general.device' }) }}
      />
    </Tab.Navigator>
  );
};

const getSettingsPayload = ({ notifications: { current } }) => ({ notifications: current });

const Stack = createStackNavigator();

const Container = () => {
  const { ucFirst } = useFormatMessage();
  const { userData, deviceList } = useSelector(store => ({
    userData: store.userData,
    deviceList: store.deviceList,
  }));
  const { email } = userData;
  const { withSpinner } = useSpinner();
  const [mobileNotifications, setMobileNotifications] = useState();

  const [settings, setSettings] = useState({});
  const [touchedSettings, setTouchedSettings] = useState({});
  const deviceId = useDeviceId();

  const dispatch = useDispatch();
  const fetchUser = useCallback(() => {
    if (email) {
      dispatch(loadUserData(email));
    }
  }, [email, dispatch]);

  const fetchSettings = useCallback(async () => {
    if (deviceId) {
      await withSpinner(() => getDeviceSettings({ deviceId }).then(setSettings));
    }
  }, [deviceId, withSpinner]);

  const saveMobileNotifications = useCallback(async () => {
    if (!mobileNotifications) {
      return;
    }
    const { mobile, selectedDevices } = userData.notifications ?? {};
    const combined = {
      mobile: { ...mobile, ...mobileNotifications?.mobile },
      selectedDevices:
        deviceList?.length > 1 ? mobileNotifications?.selectedDevices ?? selectedDevices : 'all',
    };
    await withSpinner(() => updateUserNotifications(combined));
    fetchUser();
  }, [fetchUser, mobileNotifications, withSpinner, userData, deviceList]);

  const saveSettings = useCallback(async () => {
    if (!touchedSettings) {
      return;
    }
    await withSpinner(async () => {
      await saveDeviceSettings({ deviceId, settings: getSettingsPayload(touchedSettings) });
      await fetchSettings();
      setTouchedSettings({});
    });
  }, [deviceId, touchedSettings, fetchSettings, setTouchedSettings, withSpinner]);

  const saveNotifications = useCallback(
    async () => Promise.all([saveMobileNotifications(), saveSettings()]),
    [saveMobileNotifications, saveSettings]
  );

  const getSaveNotificationsButton = useCallback(
    () =>
      mobileNotifications || !_.isEmpty(touchedSettings) ? (
        <View style={{ marginRight: 5 }}>
          <Button onPress={saveNotifications} title={ucFirst({ id: 'general.save' })} />
        </View>
      ) : null,
    [mobileNotifications, touchedSettings, saveNotifications, ucFirst]
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setMobileNotifications();
  }, [setMobileNotifications, userData]);

  useEffect(() => {
    setTouchedSettings();
  }, [setMobileNotifications, settings]);

  return (
    <NotificationsContext.Provider
      value={{
        fetchUser,
        fetchSettings,
        mobileNotifications,
        setMobileNotifications,
        userData,
        deviceList,
        settings,
        setSettings,
        touchedSettings,
        setTouchedSettings,
      }}
    >
      <Stack.Navigator initialRouteName='notifications'>
        <Stack.Screen
          name='notifications'
          component={NotificationsView}
          options={{
            title: ucFirst({ id: 'general.notifications' }),
            headerRight: getSaveNotificationsButton,
          }}
        />
      </Stack.Navigator>
    </NotificationsContext.Provider>
  );
};

export default Container;
