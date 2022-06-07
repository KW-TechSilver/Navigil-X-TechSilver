import React, { useCallback, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { format, localeStartOfWeekDay } from 'i18n/date-fns';
import { setChartFetchRange } from 'actions';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import * as dateFns from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import useFormatMessage from 'hooks/useFormatMessage';
import { actionColor } from 'core/theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: actionColor,
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    width: '25%',
  },
  buttonContent: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    height: 50,
  },
  customRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    height: 50,
  },
  buttonArrow: {
    fontSize: 30,
    alignSelf: 'center',
    padding: 10,
  },
});

const getDisplayValue = (mode, endDate) => {
  const year = dateFns.getYear(endDate);
  if (mode === 'month') {
    const month = dateFns.getMonth(endDate);
    return `${month + 1} / ${year}`;
  }
  if (mode === 'week') {
    const week = dateFns.getWeek(endDate);
    return `${week} / ${year}`;
  }
  if (mode === 'day') {
    const day = dateFns.getDate(endDate);
    const month = dateFns.getMonth(endDate);
    return `${day - 2} - ${day} / ${month + 1} / ${year}`;
  }
  throw new Error(`Invalid mode ${mode}`);
};

const Button = ({ title, ...rest }) => (
  <TouchableOpacity style={styles.button} {...rest}>
    <Text style={styles.buttonContent}>{title}</Text>
  </TouchableOpacity>
);

const getDatesForMode = ({ selectedMode, endDate }) => {
  if (selectedMode === 'day') {
    const newEndDate = dateFns.endOfDay(endDate);
    // return [dateFns.subDays(newEndDate, 0), newEndDate];
    return [dateFns.subDays(newEndDate, 2), newEndDate];
  }
  if (selectedMode === 'week') {
    const newEndDate = dateFns.endOfWeek(endDate, { weekStartsOn: localeStartOfWeekDay() });
    const newStartDate = dateFns.addDays(dateFns.subWeeks(newEndDate, 1), 1);
    return [newStartDate, newEndDate];
  }
  if (selectedMode === 'month') {
    const newEndDate = dateFns.endOfMonth(endDate);
    return [dateFns.startOfMonth(newEndDate), newEndDate];
  }
};

const Buttons = ({ binBy, setBinBy }) => {
  const dispatch = useDispatch();
  const { ucFirst } = useFormatMessage();
  const { fetchRange } = useSelector(store => ({ fetchRange: store.fetchRange.charts }));

  const [selectedMode, setSelectedMode] = useState('month');
  const [endDate, setEndDate] = useState(dateFns.endOfDay(new Date()));
  const [shouldHideCustomRange, setShouldHideCustomRange] = useState(true);

  const updateFetchRange = useCallback(() => {
    dispatch(setChartFetchRange(getDatesForMode({ selectedMode, endDate })));
  }, [dispatch, endDate, selectedMode]);

  const setSelectedModeCb = useCallback(
    newMode => {
      if (selectedMode === newMode) {
        updateFetchRange();
      } else {
        setSelectedMode(newMode);
      }
    },
    [selectedMode, setSelectedMode, updateFetchRange]
  );

  useEffect(() => {
    if (!isEmpty(binBy)) {
      if (selectedMode === 'day' && binBy !== 'hour') {
        setBinBy('hour');
      }
      if (selectedMode !== 'day' && binBy !== 'day') {
        setBinBy('day');
      }
    }
  }, [binBy, selectedMode, setBinBy]);

  const setModeDay = useCallback(() => setSelectedModeCb('day'), [setSelectedModeCb]);
  const setModeWeek = useCallback(() => setSelectedModeCb('week'), [setSelectedModeCb]);
  const setModeMonth = useCallback(() => setSelectedModeCb('month'), [setSelectedModeCb]);

  const backwardCb = useCallback(() => {
    if (selectedMode === 'day') {
      setEndDate(_endDate => dateFns.subDays(_endDate, 1));
    }
    if (selectedMode === 'week') {
      setEndDate(_endDate => dateFns.subWeeks(_endDate, 1));
    }
    if (selectedMode === 'month') {
      setEndDate(_endDate => dateFns.subMonths(_endDate, 1));
    }
  }, [selectedMode]);

  const forwardCb = useCallback(() => {
    if (selectedMode === 'day') {
      setEndDate(_endDate => dateFns.addDays(_endDate, 1));
    }
    if (selectedMode === 'week') {
      setEndDate(_endDate => dateFns.addWeeks(_endDate, 1));
    }
    if (selectedMode === 'month') {
      setEndDate(_endDate => dateFns.addMonths(_endDate, 1));
    }
  }, [selectedMode]);

  useEffect(() => {
    updateFetchRange();
  }, [updateFetchRange]);

  useEffect(() => {
    const [start, end] = getDatesForMode({ selectedMode, endDate });
    const buttonDatesMatchFetchRange =
      start.getTime() === fetchRange[0].getTime() && end.getTime() === fetchRange[1].getTime();
    setShouldHideCustomRange(buttonDatesMatchFetchRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRange]);

  return (
    <View>
      <View
        style={[styles.customRangeContainer, { display: shouldHideCustomRange ? 'none' : 'flex' }]}
      >
        <Text>
          {format(fetchRange[0], 'P')} - {format(fetchRange[1], 'P')}
        </Text>
      </View>
      <View
        style={[styles.selectorContainer, { display: !shouldHideCustomRange ? 'none' : 'flex' }]}
      >
        <TouchableOpacity onPress={backwardCb}>
          <MaterialCommunityIcons style={styles.buttonArrow} name='chevron-left' />
        </TouchableOpacity>
        <Text>
          {ucFirst({ id: `general.${selectedMode}` })}: {getDisplayValue(selectedMode, endDate)}
        </Text>
        <TouchableOpacity onPress={forwardCb}>
          <MaterialCommunityIcons style={styles.buttonArrow} name='chevron-right' />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Button title={ucFirst({ id: 'general.day' })} onPress={setModeDay} />
        <Button title={ucFirst({ id: 'general.week' })} onPress={setModeWeek} />
        <Button title={ucFirst({ id: 'general.month' })} onPress={setModeMonth} />
      </View>
    </View>
  );
};

export default Buttons;
