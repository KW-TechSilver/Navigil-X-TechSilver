import React, { useCallback, useEffect } from 'react';
import TextInput from 'components/TextInput';
import useFormatMessage from 'hooks/useFormatMessage';
import { View } from 'react-native';

const Filter = ({ text, setText, deviceData, setFilteredData }) => {
  const { ucFirst } = useFormatMessage();
  const filterTree = useCallback((rows, filterValue) => {
    const modifyData = rows;
    const filterRows = modifyData.filter(row => {
      let isFound = false;
      if (row.fullName.toLowerCase().includes(filterValue.toLowerCase())) {
        isFound = true;
      }
      if (row.serialNumber.includes(filterValue)) {
        isFound = true;
      }
      if (row.phoneNumber.includes(filterValue)) {
        isFound = true;
      }
      return isFound;
    });
    return filterRows;
  }, []);

  useEffect(() => {
    if (text && deviceData) {
      setFilteredData(filterTree(deviceData, text));
    } else {
      setFilteredData(deviceData);
    }
  }, [deviceData, filterTree, setFilteredData, text]);

  return (
    <View style={{ margin: 5 }}>
      <TextInput
        label={ucFirst({ id: 'general.search' })}
        value={text}
        mode='outlined'
        onChangeText={val => {
          setText(val);
        }}
        autoCapitalize='none'
        style={{ height: 50 }}
      />
    </View>
  );
};

export default Filter;
