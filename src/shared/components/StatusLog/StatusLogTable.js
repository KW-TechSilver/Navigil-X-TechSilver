import React, { useState, useEffect, useCallback, useRef } from 'react';
import { startOfDay, endOfDay } from 'date-fns';
import { format as formatWithLocale } from 'i18n/date-fns';
import { isUndefined } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useFormatMessage from 'hooks/useFormatMessage';
import useDeviceId from 'hooks/useDeviceId';
import useSpinner from 'hooks/useSpinner';
import { setFetchStart, setFetchEnd } from 'actions/setFetchRange';
import { toggleDatePicker } from 'actions/toggles';
import { SafeAreaView, View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { NOTIFICATIONS_INFO } from 'hooks/useNotifications/variablesAndConstants';
import { getDeviceStatusLogs } from 'api/MiddlewareAPI';
import { Card } from 'react-native-paper';
import RedSOSRecording from 'assets/svg/sosRecordingRed';
import DatePicker from 'shared/DatePicker/DatePicker';
import Filter from './Filter';

const styles = StyleSheet.create({
  item: {
    margin: 5,
  },
  headline: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

const getColor = severity => {
  switch (severity) {
    case 'alarm':
      return '#d32f2f';
    case 'warning':
      return '#ffa000';
    default:
      return '#4caf50';
  }
};

const getUpdatedIcon = item =>
  !isUndefined(item.dismissTime) && item.dismissSource !== 'system' ? (
    <MaterialCommunityIcons name='check-circle-outline' size={24} color='black' />
  ) : null;

const getAuthorName = (firstName, lastName) => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return null;
};

const dateSplit = time => {
  const splitted = time.replace(/,/g, '').split(/\s+/);
  const time1 = splitted[0];
  const time2 = splitted.splice(1).join(' ');
  return [time1, time2];
};

const Item = ({ title }) => {
  if (title) {
    let AlertImage = null;
    AlertImage = title.icon ? NOTIFICATIONS_INFO[title.icon]?.icon || null : null;
    if (title.icon === 'sosVoiceRecording') {
      AlertImage = RedSOSRecording;
    }
    const { createdTime, updatedTime } = title;
    const [createdTime1, createdTime2] = dateSplit(createdTime);
    const [updatedTime1, updatedTime2] = dateSplit(updatedTime);

    return (
      title && (
        <Card style={styles.item}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '15%', marginLeft: '1%' }}>
              {AlertImage !== null ? (
                <View style={{ backgroundColor: 'white' }}>
                  <AlertImage fill={title.severityColor} width={50} height={50} />
                </View>
              ) : null}
            </View>
            <View style={{ width: '22%', marginRight: '2%' }}>
              <Text style={{ fontSize: 14 }}>{createdTime1}</Text>
              <Text style={{ fontSize: 14 }}>{createdTime2}</Text>
            </View>
            <View style={{ width: '35%' }}>
              <Text style={{ fontSize: 14 }}>{title.content}</Text>
            </View>
            <View style={{ marginLeft: 'auto', marginRight: 0, width: 84 }}>
              <Text style={{ fontSize: 14 }}>{updatedTime1}</Text>
              <Text style={{ fontSize: 14 }}>{updatedTime2}</Text>
            </View>
          </View>
        </Card>
      )
    );
  }
};

const StatusLogTable = () => {
  const { ucFirst } = useFormatMessage();
  const [deviceLogData, setDeviceLogData] = useState();
  const deviceId = useDeviceId();
  const dispatch = useDispatch();
  const { fetchRange, showDatePicker } = useSelector(store => ({
    fetchRange: store.fetchRange.default,
    showDatePicker: store.toggles.datePicker,
  }));
  const startDate = fetchRange[0].toISOString().replace('Z', '');
  const endDate = fetchRange[1].toISOString().replace('Z', '');

  const [searchText, setSearchText] = useState('');

  const [data, setData] = useState([]);
  const dataOffset = useRef(0);
  const abort = useRef(new AbortController());

  const { withSpinner } = useSpinner();

  const getData = useCallback(async () => {
    abort.current.abort();
    abort.current = new AbortController();
    const { signal } = abort.current;
    const offset = dataOffset.current;
    const params = {
      deviceId,
      type: 'all',
      limit: 100,
      offset,
      startDate,
      endDate,
      substring: searchText,
    };
    const result = await withSpinner(() => getDeviceStatusLogs(params, { signal }));
    if (result.error) {
      return;
    }
    if (dataOffset.current === 0) {
      setData(result);
    } else {
      setData(_data => [..._data, ...result]);
    }
    dataOffset.current += result.length;
  }, [deviceId, startDate, endDate, searchText, withSpinner]);

  const onRefresh = useCallback(async () => {
    dataOffset.current = 0;
    await getData();
  }, [getData]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const setSelectedEndDate = useCallback(date => dispatch(setFetchEnd(endOfDay(new Date(date)))), [
    dispatch,
  ]);
  const setSelectedStartDate = useCallback(
    date => dispatch(setFetchStart(startOfDay(new Date(date)))),
    [dispatch]
  );
  const toggleDatePickerCb = useCallback(() => dispatch(toggleDatePicker()), [dispatch]);

  useEffect(() => {
    const makeData = () => {
      if (data) {
        const [start, end] = fetchRange.map(x => x.toISOString());
        const tempData = data
          .filter(item => item.created >= start && item.created <= end)
          .map(item => ({
            icon: item.type,
            createdTime: formatWithLocale(new Date(item.createdUTC), 'Pp'),
            content: ucFirst({
              id: `${item.severity}Message.${item.type}`,
            }),
            severity: item.severity,
            severityColor: getColor(item.severity),
            author: getAuthorName(item.firstName, item.lastName),
            updatedTime: formatWithLocale(new Date(item.dismissTimeUTC), 'Pp'),
            updatedIcon: getUpdatedIcon(item),
            value: item.value,
          }));
        setDeviceLogData(tempData);
      } else {
        setDeviceLogData([]);
      }
    };
    makeData();
  }, [data, ucFirst, fetchRange]);

  if (!deviceLogData) {
    return null;
  }
  const renderItem = ({ item }) => <Item title={item} />;
  return (
    <SafeAreaView>
      <DatePicker
        modalVisible={showDatePicker}
        setModalVisible={toggleDatePickerCb}
        setSelectedEndDate={setSelectedEndDate}
        setSelectedStartDate={setSelectedStartDate}
      />
      <Filter setText={setSearchText} />
      <View style={styles.headline}>
        <Text style={{ width: '23.5%', marginLeft: '17%', fontWeight: 'bold' }}>
          {ucFirst({ id: 'callEvaluation.date' })}
        </Text>
        <Text style={{ width: '20%', fontWeight: 'bold' }}>
          {ucFirst({ id: 'general.status' })}
        </Text>
        <Text style={{ marginLeft: 'auto', marginRight: 0, width: 89, fontWeight: 'bold' }}>
          {ucFirst({ id: 'general.dismissed' })}
        </Text>
      </View>

      <FlatList
        data={deviceLogData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item + index.toString()}
        onEndReached={getData}
        onEndReachedThreshold={2}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={false} />}
        contentContainerStyle={{ minHeight: '90%', paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
};

export default StatusLogTable;
