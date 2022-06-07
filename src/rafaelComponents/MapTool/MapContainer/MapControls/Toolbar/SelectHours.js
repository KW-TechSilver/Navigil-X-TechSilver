/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dimensions } from 'react-native';

import useFormatMessage from 'hooks/useFormatMessage';
import { setFilter, setResetSlider } from 'actions';
import { useDispatch } from 'react-redux';

const TIME_1_HOURS = 60 * 60 * 1000;
const TIME_4_HOURS = 4 * 60 * 60 * 1000;
const TIME_8_HOURS = 8 * 60 * 60 * 1000;
const TIME_16_HOURS = 16 * 60 * 60 * 1000;
const TIME_24_HOURS = 24 * 60 * 60 * 1000;

const SELECT_OPTIONS = [
  { value: '1:00 h', label: '1:00 h', lengthInMs: TIME_1_HOURS },
  { value: '4:00 h', label: '4:00 h', lengthInMs: TIME_4_HOURS },
  { value: '8:00 h', label: '8:00 h', lengthInMs: TIME_8_HOURS },
  { value: '16:00 h', label: '16:00 h', lengthInMs: TIME_16_HOURS },
  { value: '24:00 h', label: '24:00 h', lengthInMs: TIME_24_HOURS },
  { value: '48:00 h', label: '48:00 h', lengthInMs: 2 * TIME_24_HOURS },
  { value: '144:00 h', label: '7 d', lengthInMs: 7 * TIME_24_HOURS },
  { value: '288:00 h', label: '14 d', lengthInMs: 14 * TIME_24_HOURS },
  { value: '372:00 h', label: '21 d', lengthInMs: 21 * TIME_24_HOURS },
];

const newRange = timeWindow => {
  const dt = new Date();
  const endTime = dt.getTime() - dt.getTimezoneOffset() * 60 * 1000;
  return [endTime - timeWindow, endTime];
};

const newFilter = range => ({
  endDate: parseInt(range[1], 10),
  length: parseInt(range[1], 10) - parseInt(range[0], 10),
});

const SelectHours = () => {
  const { ucFirst } = useFormatMessage();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(SELECT_OPTIONS[2].value);

  useEffect(() => {
    if (selected) {
      const hoursAndMinutes = selected.split(/[:\s]/, 2).map(item => parseInt(item, 10));
      const range = newRange(hoursAndMinutes[0] * 60 * 60 * 1000 + hoursAndMinutes[1] * 60 * 1000);
      dispatch(
        setResetSlider(true) // reset slider option missing here
      );
      dispatch(setFilter({ ...newFilter(range), hoursDiff: hoursAndMinutes[0] }));
    }
  }, [selected, dispatch]);

  return (
    <DropDownPicker
      zIndex={4999}
      maxHeight={Dimensions.get('screen').height * 0.65}
      items={SELECT_OPTIONS}
      open={open}
      setOpen={setOpen}
      listMode='SCROLLVIEW'
      placeholder={ucFirst({ id: 'general.selectDefault' })}
      value={selected}
      style={{
        backgroundColor: '#ffffff',
        color: '#000',
        borderWidth: 0,
        borderRadius: 0,
        margin: 0,
        padding: 0,
        height: 40,
        fontSize: 15,
      }}
      placeholderStyle={{
        fontSize: 15,
      }}
      customItemLabelStyle={{ color: '#000', fontSize: 16 }}
      listItemContainerStyle={{
        backgroundColor: '#fafafa',
        color: '#000',
        justifyContent: 'flex-start',
        height: 40,
      }}
      dropDownContainerStyle={{
        borderColor: '#ccc',
        backgroundColor: '#fafafa',
        borderRadius: 0,
        borderWidth: 1,
        borderBottomColor: '#000',
      }}
      setValue={value => {
        setSelected(value());
      }}
    />
  );
};

export default SelectHours;
