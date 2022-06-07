import React, { useState, useEffect, useCallback } from 'react';
import { startOfDay, endOfDay } from 'date-fns';
import { format as formatWithLocale } from 'i18n/date-fns';
import useDeviceId from 'hooks/useDeviceId';
import useFormatMessage from 'hooks/useFormatMessage';
import { setFetchStart, setFetchEnd } from 'actions/setFetchRange';
import { toggleDatePicker } from 'actions/toggles';
import { useSelector, useDispatch } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView, View, StyleSheet, Text, ScrollView, RefreshControl } from 'react-native';
import { NOTIFICATIONS_INFO } from 'hooks/useNotifications/variablesAndConstants';
import useMiddlewareAPI from 'hooks/useMiddlewareAPI';
import { getCallLogRangeData } from 'api/MiddlewareAPI';
import { Card } from 'react-native-paper';
import DatePicker from 'shared/DatePicker/DatePicker';
import {
  SOS_CALL,
  NO_SOS_CALL,
  INBOUND,
  NO_INBOUND_CALL,
  INCOMING_CALL,
  OUTGOING_CALL,
} from './DeviceCallConstants';
import Filter from './Filter';

const styles = StyleSheet.create({
  item: {
    margin: 5,
  },
  headline: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
  },
});

const getColor = (callMethod, callDuration) => {
  if (callDuration === 0) {
    return '#d32f2f';
  }
  if (callMethod) {
    return '#4caf50';
  }
};

const getSoSCallData = (callMethod, callDuration) => {
  let callMethodMessage = null;
  if (callMethod === SOS_CALL && callDuration === 0) {
    callMethodMessage = NO_SOS_CALL;
  } else if (callMethod && callDuration === 0) {
    callMethodMessage = NO_INBOUND_CALL;
  } else if (callMethod === SOS_CALL) {
    callMethodMessage = SOS_CALL;
  } else {
    callMethodMessage = INBOUND;
  }
  return callMethodMessage;
};

const getInfoData = (callMethod, callDuration) => {
  if (callMethod === SOS_CALL && callDuration === 0) {
    return 'No Answer';
  }
  if (callMethod && callDuration === 0) {
    return 'No Answer';
  }
};

const arrowColors = { danger: '#d32f2f', success: '#4caf50' };

const dateSplit = time => {
  const splitted = time.replace(/,/g, '').split(/\s+/);
  const time1 = splitted[0];
  const time2 = splitted.splice(1).join(' ');
  return [time1, time2];
};

const Item = ({ title }) => {
  if (title !== undefined) {
    const { icon, callDirection, callDateAndTime } = title;

    const [callDate, callTime] = dateSplit(callDateAndTime);

    let cellValue = null;
    let AlertImage = null;
    if (icon === SOS_CALL || icon === NO_SOS_CALL) {
      cellValue = 'sosCall';
      AlertImage = cellValue ? NOTIFICATIONS_INFO[cellValue]?.icon : null;
    } else {
      cellValue = 'call';
      AlertImage = cellValue ? NOTIFICATIONS_INFO[cellValue]?.icon : null;
    }

    const callDirectionIconColor = cell => {
      if (cell.callDirection === INCOMING_CALL && cell.duration > 0) {
        return 'success';
      }
      if (cell.callDirection === OUTGOING_CALL && cell.duration > 0) {
        return 'success';
      }
      if (cell.duration === 0) {
        return 'danger';
      }
    };

    return (
      title && (
        <Card style={styles.item}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '15%' }}>
              {AlertImage !== null ? (
                <AlertImage
                  fill={arrowColors[callDirectionIconColor(title)]}
                  width={50}
                  height={50}
                />
              ) : null}
            </View>
            <View style={{ width: '25%' }}>
              <Text style={{ fontSize: 14 }}>{callDate}</Text>
              <Text style={{ fontSize: 14 }}>{callTime}</Text>
            </View>
            <View>
              <Text>{`+${title.phoneNumber}`}</Text>
            </View>
            {callDirection === INCOMING_CALL ? (
              <View style={{ marginLeft: 'auto', marginRight: '3%' }}>
                <Entypo
                  name='arrow-long-left'
                  size={40}
                  color={arrowColors[callDirectionIconColor(title)]}
                />
                <Text style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: -5 }}>
                  {`${title.duration} s`}
                </Text>
              </View>
            ) : (
              <View style={{ marginLeft: 'auto', marginRight: '3%' }}>
                <Entypo
                  name='arrow-long-right'
                  size={40}
                  color={arrowColors[callDirectionIconColor(title)]}
                />
                <Text style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: -5 }}>
                  {`${title.duration} s`}
                </Text>
              </View>
            )}
          </View>
        </Card>
      )
    );
  }
};

const CallLogTable = () => {
  const { ucFirst } = useFormatMessage();
  const dispatch = useDispatch();
  const { fetchRange, showDatePicker } = useSelector(store => ({
    fetchRange: store.fetchRange.default,
    showDatePicker: store.toggles.datePicker,
  }));
  const [deviceLogData, setDeviceLogData] = useState();
  const deviceId = useDeviceId();

  const [filteredData, setFilteredData] = useState([]);

  const [data, getData] = useMiddlewareAPI(
    {
      function: [
        getCallLogRangeData,
        {
          deviceId,
          type: 'all',
          startDate: fetchRange[0].toISOString().replace('Z', ''),
          endDate: fetchRange[1].toISOString().replace('Z', ''),
        },
      ],
      defaultValue: [],
      spinner: true,
    },
    [deviceId, fetchRange]
  );

  const setSelectedEndDate = useCallback(date => dispatch(setFetchEnd(endOfDay(new Date(date)))), [
    dispatch,
  ]);
  const setSelectedStartDate = useCallback(
    date => dispatch(setFetchStart(startOfDay(new Date(date)))),
    [dispatch]
  );
  const toggleDatePickerCb = useCallback(() => dispatch(toggleDatePicker()), [dispatch]);

  useEffect(() => {
    if (data) {
      setDeviceLogData(
        data.map(item => ({
          icon: getSoSCallData(item.callMethod, item.callDuration),
          phoneNumber: item.MSISDN,
          callDateAndTime: formatWithLocale(new Date(item.created), 'Pp'),
          duration: item.callDuration,
          callMethod: item.callMethod,
          hangupSource: item.hangupSourceStr,
          callDirection: item.callDirectionStr,
          severityColor: getColor(item.callMethod, item.callDuration),
          info: getInfoData(item.callMethod, item.callDuration),
          callEvaluation: item,
          callReferenceNumber: item.callReferenceNumber,
        }))
      );
    } else {
      setDeviceLogData([]);
    }
  }, [data]);

  const renderItem = item => <Item title={item} key={item.id} />;

  if (!data) {
    return null;
  }
  return (
    <SafeAreaView style={{ marginHorizontal: 0 }}>
      <Filter deviceData={deviceLogData} setFilteredData={setFilteredData} />
      <View style={styles.headline}>
        <Text style={{ marginLeft: '16%', width: '25%', fontWeight: 'bold' }}>
          {ucFirst({ id: 'callEvaluation.date' })}
        </Text>
        <Text style={{ fontWeight: 'bold' }}>{ucFirst({ id: 'general.phone' })}</Text>
        <Text style={{ marginRight: '3%', marginLeft: 'auto', fontWeight: 'bold' }}>
          {ucFirst({ id: 'callEvaluation.details' })}
        </Text>
      </View>
      <DatePicker
        modalVisible={showDatePicker}
        setModalVisible={toggleDatePickerCb}
        setSelectedEndDate={setSelectedEndDate}
        setSelectedStartDate={setSelectedStartDate}
      />
      <ScrollView
        contentContainerStyle={{ minHeight: '100%' }}
        refreshControl={<RefreshControl onRefresh={getData} refreshing={false} />}
      >
        {filteredData?.length > 0 ? (
          <View>{filteredData.map(renderItem)}</View>
        ) : (
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: '10%' }}>
            <Text>{ucFirst({ id: 'general.noDataAvailable' })}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CallLogTable;
