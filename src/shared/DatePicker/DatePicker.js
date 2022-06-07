// React Native Calendar Picker using react-native-calendar-picker
// https://aboutreact.com/react-native-calendar-picker/

// import React in our code
import React, { useCallback } from 'react';
// import all the components we are going to use
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { actionColor } from 'core/theme';
import { format as formatWithLocale } from 'i18n/date-fns';

// import CalendarPicker from the package we installed
import CalendarPicker from 'react-native-calendar-picker';

import useFormatMessage from 'hooks/useFormatMessage';

const styles = StyleSheet.create({
  container: {
    flex: 2,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  textStyle: {
    color: actionColor,
    textAlign: 'center',
    fontSize: 18,
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: 20,
    margin: 20,
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
});

const DatePicker = ({
  modalVisible,
  setModalVisible,
  setSelectedEndDate,
  setSelectedStartDate,
}) => {
  const { ucFirst } = useFormatMessage();

  const onDateChange = useCallback(
    (date, type) => {
      if (type === 'END_DATE') {
        setSelectedEndDate(formatWithLocale(new Date(date), 'yyyy-MM-dd'));
      }
      if (type === 'START_DATE') {
        setSelectedStartDate(formatWithLocale(new Date(date), 'yyyy-MM-dd'));
      }
    },
    [setSelectedEndDate, setSelectedStartDate]
  );
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
              borderRadius: 10,
              paddingTop: 10,
              backgroundColor: '#FFFFFF',
            }}
          >
            <CalendarPicker
              startFromMonday
              allowRangeSelection
              maxDate={new Date(2050, 6, 3)}
              weekdays={[
                ucFirst({ id: 'date.mon' }),
                ucFirst({ id: 'date.tue' }),
                ucFirst({ id: 'date.wed' }),
                ucFirst({ id: 'date.thu' }),
                ucFirst({ id: 'date.fri' }),
                ucFirst({ id: 'date.sat' }),
                ucFirst({ id: 'date.sun' }),
              ]}
              months={[
                ucFirst({ id: 'month.jan' }),
                ucFirst({ id: 'month.feb' }),
                ucFirst({ id: 'month.mar' }),
                ucFirst({ id: 'month.apr' }),
                ucFirst({ id: 'month.may' }),
                ucFirst({ id: 'month.jun' }),
                ucFirst({ id: 'month.jul' }),
                ucFirst({ id: 'month.aug' }),
                ucFirst({ id: 'month.sep' }),
                ucFirst({ id: 'month.oct' }),
                ucFirst({ id: 'month.nov' }),
                ucFirst({ id: 'month.dec' }),
              ]}
              previousTitle={ucFirst({ id: 'general.previous' })}
              nextTitle={ucFirst({ id: 'general.next' })}
              todayBackgroundColor='#ADD8E6'
              selectedDayColor='#87CEFA'
              selectedDayTextColor='#000000'
              scaleFactor={375}
              width={Dimensions.get('screen').width * 0.9}
              textStyle={{
                fontFamily: Platform.OS === 'android' ? 'sans-serif' : 'Helvetica',
                color: '#000000',
              }}
              onDateChange={onDateChange}
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
export default DatePicker;
