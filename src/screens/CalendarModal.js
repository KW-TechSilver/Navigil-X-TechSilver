import _ from 'lodash';
import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useFormatMessage from 'hooks/useFormatMessage';
import useMiddlewareAPI from 'hooks/useMiddlewareAPI';
import { format } from 'i18n/date-fns';
import { addDays } from 'date-fns';
import { setFilter } from 'actions';
import { Calendar } from 'react-native-calendars';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { getCoordinateDates } from 'api/MiddlewareAPI';
import { actionColor } from 'core/theme';

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  button: {
    borderRadius: 10,
    width: 150,
    height: 40,
    margin: 4,
  },
  buttonClose: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
  },
  textStyle: {
    color: actionColor,
    textAlign: 'center',
    fontSize: 18,
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const EXCLUDED_VALUE = { disabled: true, disableTouchEvent: true };

const inBetween = ([a, b]) => {
  const _between = [];
  let _current = addDays(a, 1);
  while (_current < b) {
    _between.push(_current);
    _current = addDays(_current, 1);
  }
  return _between;
};

const useExcludedDates = ({ deviceId }) => {
  const [dates] = useMiddlewareAPI({ function: [getCoordinateDates, { deviceId }] }, [deviceId]);

  return useMemo(() => {
    if (!dates?.length) {
      return [null, null, []];
    }

    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];
    const excludedDates = _.zip(dates.slice(0, -1), dates.slice(1))
      .map(inBetween)
      .flat()
      .map(x => [format(x, 'yyyy-MM-dd'), EXCLUDED_VALUE]);

    return [minDate, maxDate, excludedDates];
  }, [dates]);
};

const CalendarModal = ({ modalVisible, setModalVisible, deviceId }) => {
  const [minDate, maxDate, excludedDates] = useExcludedDates({ deviceId });
  const [datePickerDate, setDatePickerDate] = useState(new Date().setUTCHours(23, 59, 59, 999));
  const dispatch = useDispatch();
  const { ucFirst } = useFormatMessage();

  const changeFilter = useCallback(
    date => {
      setDatePickerDate(date);
      const newFormat = new Date(date.dateString).setUTCHours(23, 59, 59, 999);
      const filter = {
        endDate: newFormat,
        length: 86400000,
      };
      dispatch(setFilter(filter));
      setModalVisible(false);
    },
    [dispatch, setModalVisible]
  );

  const _maxDate = useMemo(() => addDays(maxDate, 0), [maxDate]);

  return (
    <View>
      <Modal
        animationType='fade'
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
        style={styles.modalContent}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
            }}
          >
            <Calendar
              current={datePickerDate || new Date(new Date().setUTCHours(23, 59, 59, 999))}
              markedDates={Object.fromEntries(excludedDates)}
              // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
              minDate={minDate}
              maxDate={_maxDate}
              onDayPress={changeFilter}
              style={{
                width: Dimensions.get('screen').width * 0.9,
                borderWidth: 0,
                borderRadius: 10,
              }}
              selectedDayBackgroundColor='black'
              theme={{
                monthTextColor: '#165c96',
                arrowColor: '#165c96',
                todayTextColor: '#33a8e2',
                selectedDayTextColor: 'white',
                selectedDayBackgroundColor: 'black',
              }}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>{ucFirst({ id: 'general.close' })}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default CalendarModal;
