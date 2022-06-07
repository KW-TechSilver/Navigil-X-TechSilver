import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from 'react-native-paper';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Paragraph from 'components/Paragraph';
import useFormatMessage from 'hooks/useFormatMessage';
import useDeviceId from 'hooks/useDeviceId';
import { putEmergencyRecording } from 'api/MiddlewareAPI';
import { fetchEmergencyRecordings, fetchActiveStatus } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import GreenSOSRecording from 'assets/svg/sosRecordingGreen';
import RedSOSRecording from 'assets/svg/sosRecordingRed';
import { startOfDay, endOfDay } from 'date-fns';
import { setFetchEnd, setFetchStart } from 'actions/setFetchRange';
import { toggleDatePicker } from 'actions/toggles';
import { actionColor } from 'core/theme';
import DatePicker from 'shared/DatePicker/DatePicker';
import AudioPlayer from './AudioPlayer';

const styles = StyleSheet.create({
  item: {
    margin: 5,
  },
  headline: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
  },
});

const DimissedBy = (data, userData, dispatch) =>
  putEmergencyRecording({
    ...data,
    dismissUserId: userData.id,
    dismissedAt: new Date().toISOString(),
  }).then(() => {
    dispatch(fetchEmergencyRecordings(data.deviceId));
    dispatch(fetchActiveStatus(data.deviceId));
  });

const split = (time, index = 1) => {
  const splitted = time.replace(/,/g, '').split(/\s+/);
  const time1 = splitted.splice(0, index).join(' ');
  const time2 = splitted.join(' ');
  return [time1, time2];
};

const Item = ({ sosMessage }) => {
  const { callDateAndTime, dismissed, dismissUserId } = sosMessage;
  const userData = useSelector(store => store.userData);
  const dispatch = useDispatch();
  const { ucFirst } = useFormatMessage();

  if (!sosMessage) {
    return null;
  }

  const _callDateAndTime = callDateAndTime && split(callDateAndTime);
  const _dismissed = dismissed && split(dismissed, 2);
  const { href } = sosMessage.link;
  const replaceHref = `${href.slice(0, -1)}`;

  return (
    <Card style={styles.item}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 70,
        }}
      >
        <View style={{ width: '13%', marginLeft: '3%' }}>
          <AudioPlayer href={replaceHref} />
        </View>
        <View style={{ width: '25%' }}>
          <Text>{_callDateAndTime[0]}</Text>
          <Text>{_callDateAndTime[1]}</Text>
        </View>

        <View style={{ width: '36%', marginBottom: 5 }}>
          <TouchableOpacity
            style={{
              backgroundColor: dismissUserId ? 'rgba(0, 0, 0, 0.26)' : actionColor,
              color: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              height: 30,
              borderRadius: 5,
              marginBottom: 5,
              marginTop: 5,
            }}
            activeOpacity={dismissUserId ? 1 : 0.7}
            onPress={() => DimissedBy(sosMessage, userData, dispatch)}
          >
            <Text style={{ fontSize: 16, color: 'white', marginLeft: 'auto', marginRight: 'auto' }}>
              {dismissUserId
                ? ucFirst({ id: 'general.dismissedBy' })
                : ucFirst({ id: 'general.dismiss' })}
            </Text>
          </TouchableOpacity>
          {dismissed && (
            <>
              <Text>{_dismissed[0]}</Text>
              <Text>{_dismissed[1]}</Text>
            </>
          )}
        </View>
        <View style={{ marginRight: '5%', marginLeft: 'auto', activeOpacity: 0.7 }}>
          {dismissed ? (
            <GreenSOSRecording fill='white' stroke='white' width={50} height={50} />
          ) : (
            <RedSOSRecording fill='white' stroke='white' width={50} height={50} />
          )}
        </View>
      </View>
    </Card>
  );
};

const makeSOSMessagesData = (emergencyRecordings, fetchRange) => {
  const [start, end] = fetchRange.map(x => x.toISOString());
  return emergencyRecordings
    .filter(({ created }) => created >= start && created <= end)
    .map(({ link, callDateAndTime, ...rest }) => ({
      ...rest,
      icon: rest,
      callDateAndTime,
      link: { ...link },
      dismiss: { ...rest },
      download: { ...link },
    }));
};

const SOSMessageTable = () => {
  const { ucFirst } = useFormatMessage();
  const dispatch = useDispatch();
  const deviceId = useDeviceId();
  const { fetchRange, showDatePicker, emergencyRecordings } = useSelector(store => ({
    fetchRange: store.fetchRange.default,
    showDatePicker: store.toggles.datePicker,
    emergencyRecordings: store.emergencyRecordings,
  }));
  const [SOSMessagesData, setSOSMessagesData] = useState([]);
  const renderItem = useCallback(item => <Item sosMessage={item} key={item.id} />, []);

  const setSelectedEndDate = useCallback(date => dispatch(setFetchEnd(endOfDay(new Date(date)))), [
    dispatch,
  ]);

  const setSelectedStartDate = useCallback(
    date => dispatch(setFetchStart(startOfDay(new Date(date)))),
    [dispatch]
  );

  const onRefresh = useCallback(() => {
    if (deviceId) {
      dispatch(fetchEmergencyRecordings(deviceId));
      dispatch(fetchActiveStatus(deviceId));
    }
  }, [deviceId, dispatch]);

  const toggleDatePickerCb = useCallback(() => dispatch(toggleDatePicker()), [dispatch]);

  useEffect(() => {
    setSOSMessagesData(makeSOSMessagesData(emergencyRecordings, fetchRange));
  }, [emergencyRecordings, fetchRange]);

  const dismissedMessages = useMemo(() => SOSMessagesData.filter(({ dismissed }) => dismissed), [
    SOSMessagesData,
  ]);
  const notDismissedMessages = useMemo(
    () => SOSMessagesData.filter(({ dismissed }) => !dismissed),
    [SOSMessagesData]
  );

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{ minHeight: '100%' }}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={false} />}
      >
        <DatePicker
          modalVisible={showDatePicker}
          setModalVisible={toggleDatePickerCb}
          setSelectedEndDate={setSelectedEndDate}
          setSelectedStartDate={setSelectedStartDate}
        />
        {SOSMessagesData?.length ? (
          <View>
            <View style={styles.headline} />
            <View>
              {notDismissedMessages?.length ? notDismissedMessages.map(renderItem) : null}
            </View>
            {dismissedMessages?.length ? (
              <Paragraph fontSize={20} color='gray' marginLeft={5} marginTop={10}>
                {ucFirst({ id: 'general.dismissed' })}
              </Paragraph>
            ) : null}
            <View>{dismissedMessages?.length ? dismissedMessages.map(renderItem) : null}</View>
          </View>
        ) : (
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: '10%' }}>
            <Text>{ucFirst({ id: 'general.noDataAvailable' })}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SOSMessageTable;
