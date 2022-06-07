import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { toggleDatePicker } from 'actions/toggles';
import { useDispatch, useSelector } from 'react-redux';
import { setChartFetchEnd, setChartFetchStart } from 'actions/setFetchRange';
import { startOfDay, endOfDay } from 'date-fns';
import DatePicker from 'shared/DatePicker/DatePicker';

const CalendarComponent = () => {
  const dispatch = useDispatch();
  const toggleDatePickerCb = useCallback(() => dispatch(toggleDatePicker()), [dispatch]);

  const { showDatePicker } = useSelector(store => ({
    showDatePicker: store.toggles.datePicker,
  }));

  const setSelectedEndDate = useCallback(
    date => dispatch(setChartFetchEnd(endOfDay(new Date(date)))),
    [dispatch]
  );

  const setSelectedStartDate = useCallback(
    date => dispatch(setChartFetchStart(startOfDay(new Date(date)))),
    [dispatch]
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <DatePicker
          modalVisible={showDatePicker}
          setModalVisible={toggleDatePickerCb}
          setSelectedEndDate={setSelectedEndDate}
          setSelectedStartDate={setSelectedStartDate}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarComponent;
