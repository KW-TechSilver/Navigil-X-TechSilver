import React, { useState, useCallback } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import { AntDesign } from 'react-native-vector-icons';
import { useDispatch } from 'react-redux';
import { fetchActiveStatus } from 'actions';
import { dismissNotification } from 'api/MiddlewareAPI';
import useFormatMessage from 'hooks/useFormatMessage';
import Paragraph from 'components/Paragraph';
import useDeviceId from 'hooks/useDeviceId';
import { useNotifications } from 'hooks/useNotifications/useNotifications';
import { actionColor } from 'core/theme';

import Badge from './Badge';

const styles = StyleSheet.create({
  badge: {
    margin: 5,
  },
  dismissView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: actionColor,
    marginTop: 5,
  },
  dismissViewText: {
    color: 'white',
    fontSize: 17,
  },
});

const DEFAULT_NOTIFICATIONS = {
  alarms: [],
  warnings: [],
  info: [],
};

const DismissableBadge = ({ badge, onDismiss }) => {
  const { ucFirst } = useFormatMessage();
  const [open, setOpen] = useState(false);

  const toggleOpen = useCallback(() => setOpen(_open => !_open), []);
  const handleNo = useCallback(() => setOpen(false), []);
  const handleYes = useCallback(() => onDismiss(badge), [onDismiss, badge]);

  return (
    <View style={styles.badge}>
      <TouchableOpacity onPress={toggleOpen}>
        <Badge style={styles.badge} badge={badge} />
      </TouchableOpacity>
      {open && (
        <View style={styles.dismissView}>
          <TouchableOpacity onPress={handleNo}>
            <AntDesign name='close' size={30} color='white' />
          </TouchableOpacity>
          <Text style={styles.dismissViewText}>
            {ucFirst({ id: 'watchDashboard.dismissNotification' })}
          </Text>
          <TouchableOpacity onPress={handleYes}>
            <AntDesign name='check' size={30} color='white' />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const AlarmAndWarningBadges = () => {
  const dispatch = useDispatch();
  const { ucFirst } = useFormatMessage();
  const deviceId = useDeviceId();
  const [{ alarms, warnings, info }] = useNotifications({
    deviceId,
    defaultValue: DEFAULT_NOTIFICATIONS,
  });
  const badges = [...alarms, ...warnings, ...info];

  const onRefresh = useCallback(() => {
    if (deviceId) {
      dispatch(fetchActiveStatus(deviceId));
    }
  }, [deviceId, dispatch]);

  const onDismiss = useCallback(
    badge => {
      const { type } = badge?.badgeProps ?? {};
      dismissNotification({ deviceId, type }).then(onRefresh);
    },
    [onRefresh, deviceId]
  );

  const dismissable = badges.filter(item => item.dismissable);
  const nonDismissable = badges.filter(item => !item.dismissable);

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{ minHeight: '100%' }}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={false} />}
      >
        {dismissable.length > 0 ? (
          <>
            <Paragraph fontSize={20} color='gray' marginLeft={5}>
              {ucFirst({ id: 'watchDashboard.dismissableAlertsAndWarnings' })}
            </Paragraph>

            {dismissable.map(badge => (
              <DismissableBadge badge={badge} onDismiss={onDismiss} key={badge.id} />
            ))}
          </>
        ) : null}

        {nonDismissable.length > 0 ? (
          <>
            <Paragraph fontSize={20} color='gray' marginLeft={5}>
              {ucFirst({ id: 'watchDashboard.statusAlertsAndWarnings' })}
            </Paragraph>
            {nonDismissable.map(badge => (
              <View style={styles.badge} key={badge.id}>
                <Badge style={styles.badge} badge={badge} />
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlarmAndWarningBadges;
