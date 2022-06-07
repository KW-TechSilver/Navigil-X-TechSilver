import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Linking,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { format } from 'i18n/date-fns';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from 'react-native-vector-icons';
import {
  fetchEmergencyRecordings,
  loadDeviceList,
  fetchActiveStatus,
  toggleDatePicker,
  setIsEmergencyTracking,
  resetFetchRanges,
} from 'actions';
import { actionColor } from 'core/theme';
import useFormatMessage from 'hooks/useFormatMessage';
import useDeviceId from 'hooks/useDeviceId';
import { useNotifications } from 'hooks/useNotifications/useNotifications';
import useEmergencyTracking from 'hooks/useEmergencyTracking';
import SelectDevice from 'components/SelectDevice';
import Badge from 'components/Badge';
import AlarmAndWarningBadges from 'components/AlarmAndWarningBadges';
import SOSMessagesTable from 'shared/components/SOSMessages/SOSMessageTable';
import CallLogTable from 'shared/components/CallLog/CallLogTable';
import StatusLogTable from 'shared/components/StatusLog/StatusLogTable';
import DeviceInfo from 'shared/components/DeviceInfo/DeviceInfo';
import HelpIcon from 'shared/components/HelpIcon';
import PrimaryButton from 'shared/components/PrimaryButton';

import Charts from './Charts';

const WATCH_DASHBOARD_HELP = '/watch-dashboard';
const ALARMS_HELP = '/watch-dashboard#WatchDashboard-Alerts';

const MAIN_SCREEN = 'general.dashboard';
const SOS_MESSAGES_ID = 'adminMenu.sosMessages';
const CALL_LOG_ID = 'adminMenu.deviceCallLog';
const STATUS_LOG_ID = 'general.statusLog';
const ALERTS_ID = 'general.alerts';
const DEVICE_INFO_ID = 'general.info';
const CHARTS = 'general.charts';
const ITEMS = [
  {
    name: SOS_MESSAGES_ID,
    iconName: 'recording-outline',
    IconComponent: Ionicons,
  },
  { name: CALL_LOG_ID, iconName: 'phone-hangup', IconComponent: MaterialCommunityIcons },
  { name: STATUS_LOG_ID, iconName: 'format-list-bulleted', IconComponent: MaterialCommunityIcons },
  { name: ALERTS_ID, iconName: 'alert-outline', IconComponent: MaterialCommunityIcons },
  { name: DEVICE_INFO_ID, iconName: 'information-outline', IconComponent: MaterialCommunityIcons },
  { name: CHARTS, iconName: 'chart-bar-stacked', IconComponent: MaterialCommunityIcons },
];

const DEFAULT_NOTIFICATIONS = {
  alarms: [],
  warnings: [],
  info: [],
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  buttonIcon: {
    fontSize: 25,
    width: '12%',
  },
  buttonText: {
    fontSize: 19,
    width: '60%',
  },
  buttonNotifications: {
    width: '22%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonArrow: {
    fontSize: 25,
    alignSelf: 'center',
    marginLeft: '2%',
  },
  navigationList: {
    marginBottom: 5,
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 0,
    padding: 5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 15,
  },
  infoTextContainer: {
    width: '65%',
  },
  actionButtonIcon: {
    marginTop: 1,
    color: '#fff',
    fontSize: 25,
    marginRight: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  batteryIndicator: {
    paddingLeft: 5,
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
  },
  batteryIndicatorContent: {
    fontSize: 26,
    margin: 5,
  },
  actionButtonsContainer: {
    marginBottom: 80,
  },
});

const getBatteryIcon = ({ percentage }) => {
  if (percentage >= 75) {
    return 'battery-4';
  }
  if (percentage >= 50) {
    return 'battery-3';
  }
  if (percentage >= 15) {
    return 'battery-2';
  }
  if (percentage > 0) {
    return 'battery-1';
  }
  return 'battery-0';
};

const BatteryIndicator = ({ device }) => {
  const iconName = getBatteryIcon(device);
  return (
    <View style={styles.batteryIndicator}>
      <FontAwesome style={styles.batteryIndicatorContent} name={iconName} />
      <Text style={styles.batteryIndicatorContent}>
        {typeof device.percentage === 'number' && `${device.percentage} %`}
      </Text>
    </View>
  );
};

const Info = ({ device }) => {
  const { ucFirst } = useFormatMessage();
  const { statusUpdateTime, networkSignal } = device.deviceStatus;
  const formattedStatusTime = statusUpdateTime
    ? format(new Date(statusUpdateTime * 1000), 'Pp')
    : '';
  return (
    <View>
      <View style={styles.info}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoText}>
            {ucFirst({ id: 'watchDashboard.statusDate' })}: {formattedStatusTime}
          </Text>
          <Text style={styles.infoText}>
            {ucFirst({ id: 'watchDashboard.networkSignal' })}: {networkSignal}
          </Text>
        </View>
        <BatteryIndicator device={device} />
      </View>
    </View>
  );
};

const NotificationBubble = ({ count, color }) => (
  <View
    style={{
      height: 25,
      width: 25,
      backgroundColor: count ? color : 'white',
      borderRadius: 20,
      justifyContent: 'center',
      marginLeft: '3%',
    }}
  >
    <Text style={{ marginLeft: 'auto', marginRight: 'auto', color: 'white' }}>{count}</Text>
  </View>
);

const NotificationBubbles = ({ name, sosCount, notifications }) => {
  const { alarms, warnings, info } = notifications;
  if (name === SOS_MESSAGES_ID) {
    return (
      <View style={[styles.buttonNotifications]}>
        <NotificationBubble count={sosCount} color='#d32f2f' />
      </View>
    );
  }
  if (name === ALERTS_ID) {
    return (
      <View style={styles.buttonNotifications}>
        {info?.length ? <NotificationBubble count={info?.length} color='#4caf50' /> : null}
        {warnings?.length ? <NotificationBubble count={warnings?.length} color='#ff9800' /> : null}
        {alarms?.length ? <NotificationBubble count={alarms?.length} color='#d32f2f' /> : null}
      </View>
    );
  }
  return <View style={styles.buttonNotifications} />;
};

const Item = ({ item: { name }, navigation, sosCount, notifications }) => {
  const { ucFirst } = useFormatMessage();
  const { iconName, IconComponent } = ITEMS.find(x => x.name === name);
  const doNavigate = useCallback(() => navigation.navigate(name), [navigation, name]);
  return (
    <TouchableOpacity onPress={doNavigate}>
      <View style={styles.button}>
        <IconComponent style={styles.buttonIcon} name={iconName} />
        <Text style={styles.buttonText}>{ucFirst({ id: name })}</Text>
        <NotificationBubbles name={name} sosCount={sosCount} notifications={notifications} />
        <MaterialCommunityIcons style={styles.buttonArrow} name='chevron-right' />
      </View>
    </TouchableOpacity>
  );
};

const Navigation = ({ navigation, notifications }) => {
  const { emergencyRecordings } = useSelector(state => ({
    emergencyRecordings: state.emergencyRecordings,
  }));
  const sosCount = emergencyRecordings.filter(({ dismissUserId }) => !dismissUserId).length;
  const renderItem = useCallback(
    item => (
      <Item
        key={item.name}
        item={item}
        navigation={navigation}
        sosCount={sosCount}
        notifications={notifications}
      />
    ),
    [navigation, sosCount, notifications]
  );
  return <View style={styles.navigationList}>{ITEMS.map(renderItem)}</View>;
};

const EmergencyTrackingButton = () => {
  const { ucFirst } = useFormatMessage();
  const [isTracking, start, stop] = useEmergencyTracking();
  const buttonStyle = useMemo(
    () => isTracking && { backgroundColor: '#d32f2f', borderColor: '#d32f2f' },
    [isTracking]
  );
  const buttonText = useMemo(
    () => (isTracking ? 'general.stopEmergencyTracking' : 'general.startEmergencyTracking'),
    [isTracking]
  );
  const toggle = useCallback(() => (isTracking ? stop() : start()), [isTracking, stop, start]);
  return (
    <PrimaryButton style={buttonStyle} onPress={toggle}>
      <Text style={styles.actionButtonText}>{ucFirst({ id: buttonText })}</Text>
    </PrimaryButton>
  );
};

const ActionButtons = ({ device }) => {
  const { phoneNumber } = device;
  const callNumber = useCallback(() => Linking.openURL(`tel:+${phoneNumber}`), [phoneNumber]);
  return (
    <View style={styles.actionButtonsContainer}>
      <PrimaryButton onPress={callNumber}>
        <Ionicons style={styles.actionButtonIcon} name='call' />
        <Text style={styles.actionButtonText}>{`+${device.phoneNumber}`}</Text>
      </PrimaryButton>
      <EmergencyTrackingButton />
    </View>
  );
};

const SingleAlertBadge = ({ notifications }) => {
  const { alarms, warnings, info } = notifications;
  const badges = [...alarms, ...warnings, ...info];
  if (badges.length === 0) {
    return null;
  }
  return <Badge badge={badges[0]} />;
};

function DashboardMain({ navigation }) {
  const dispatch = useDispatch();
  const { deviceList } = useSelector(state => ({ deviceList: state.deviceList }));
  const deviceId = useDeviceId();
  const device = deviceList?.find(x => x.deviceId === deviceId);
  const [notifications] = useNotifications({
    deviceId,
    defaultValue: DEFAULT_NOTIFICATIONS,
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    const _emergencyTracking = !!notifications.alarms.find(
      item => item.id === 'emergTrackingActive'
    );
    dispatch(setIsEmergencyTracking(_emergencyTracking));
  }, [dispatch, notifications.alarms]);

  const onRefresh = useCallback(() => {
    const actions = [];
    actions.push(resetFetchRanges());
    actions.push(loadDeviceList());
    if (deviceId) {
      actions.push(fetchActiveStatus(deviceId));
      actions.push(fetchEmergencyRecordings(deviceId));
    }
    actions.forEach(dispatch);
    Promise.all(actions);
  }, [deviceId, dispatch]);

  const prevDeviceId = useRef();
  useEffect(() => {
    if (isFocused && prevDeviceId.current !== deviceId) {
      onRefresh();
      prevDeviceId.current = deviceId;
    }
  }, [dispatch, isFocused, onRefresh, deviceId]);

  return (
    <View>
      <SelectDevice />
      <ScrollView
        contentContainerStyle={{ minHeight: '100%' }}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={false} />}
      >
        {device && (
          <>
            <Info device={device} />
            <SingleAlertBadge notifications={notifications} />
            <Navigation device={device} navigation={navigation} notifications={notifications} />
            <ActionButtons device={device} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const Stack = createStackNavigator();

const WatchHome = () => {
  const { ucFirst } = useFormatMessage();
  const dispatch = useDispatch();
  const toggleDatePickerCb = useCallback(() => dispatch(toggleDatePicker()), [dispatch]);
  const getCalendarButton = useCallback(
    () => (
      <TouchableOpacity onPress={toggleDatePickerCb}>
        <MaterialCommunityIcons
          name='calendar-today'
          size={30}
          color={actionColor}
          style={{ marginRight: 15, marginTop: 3 }}
        />
      </TouchableOpacity>
    ),
    [toggleDatePickerCb]
  );

  const getDashboardHelp = useCallback(() => <HelpIcon url={WATCH_DASHBOARD_HELP} />, []);
  const getAlarmsHelp = useCallback(() => <HelpIcon url={ALARMS_HELP} />, []);

  return (
    <Stack.Navigator initialRouteName={MAIN_SCREEN}>
      <Stack.Screen
        name={MAIN_SCREEN}
        component={DashboardMain}
        options={{ title: ucFirst({ id: MAIN_SCREEN }), headerRight: getDashboardHelp }}
      />
      <Stack.Screen
        name={SOS_MESSAGES_ID}
        component={SOSMessagesTable}
        options={{ title: ucFirst({ id: SOS_MESSAGES_ID }), headerRight: getCalendarButton }}
      />
      <Stack.Screen
        name={CALL_LOG_ID}
        component={CallLogTable}
        options={{ title: ucFirst({ id: CALL_LOG_ID }), headerRight: getCalendarButton }}
      />
      <Stack.Screen
        name={STATUS_LOG_ID}
        component={StatusLogTable}
        options={{ title: ucFirst({ id: STATUS_LOG_ID }), headerRight: getCalendarButton }}
      />
      <Stack.Screen
        name={DEVICE_INFO_ID}
        component={DeviceInfo}
        options={{ title: ucFirst({ id: DEVICE_INFO_ID }) }}
      />
      <Stack.Screen
        name={CHARTS}
        component={Charts}
        options={{ title: ucFirst({ id: CHARTS }), headerShown: false }}
      />
      <Stack.Screen
        name={ALERTS_ID}
        component={AlarmAndWarningBadges}
        options={{ title: ucFirst({ id: ALERTS_ID }), headerRight: getAlarmsHelp }}
      />
    </Stack.Navigator>
  );
};

export default WatchHome;
