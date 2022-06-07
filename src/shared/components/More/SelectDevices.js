import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { actionColor } from 'core/theme';
import DropDownPicker from 'react-native-dropdown-picker';
import useFormatMessage from 'hooks/useFormatMessage';
import { selectDeviceOptions } from 'components/SelectDevice';

const labelStyle = { fontSize: 17 };

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: actionColor,
    borderRadius: 10,
    padding: 8,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonText: {
    ...labelStyle,
    color: 'white',
  },
  container: {
    width: '100%',
  },
});

const EMPTY_ARRAY = [];

const SelectDevices = ({ value, setValue }) => {
  const { ucFirst } = useFormatMessage();
  const [open, setOpen] = useState(false);

  const { deviceList } = useSelector(state => ({ deviceList: state.deviceList }));
  const listOptions = useMemo(() => selectDeviceOptions(deviceList, { valueType: 'deviceId' }), [
    deviceList,
  ]);
  const all = useMemo(() => listOptions.map(item => item.value), [listOptions]);
  const selected = useMemo(
    () => (value instanceof Array ? value.filter(item => all.includes(item)) : EMPTY_ARRAY),
    [value, all]
  );
  const currentValue = value === 'all' ? all : selected;

  // This is required because DropDownPicker seems to be using an old value of setValueCb even if we update it
  const valueRef = useRef(currentValue);
  valueRef.current = currentValue;

  const setValueCb = useCallback(cb => setValue(cb(valueRef.current)), [setValue, valueRef]);
  const selectAll = useCallback(() => setValue('all'), [setValue]);
  const selectNone = useCallback(() => setValue([]), [setValue]);

  useEffect(() => {
    if (!value) {
      selectAll();
    }
  }, [selectAll, value]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        listMode='MODAL'
        style={{
          backgroundColor: 'transparent',
          color: '#000',
          borderWidth: 0,
          borderRadius: 0,
          marginLeft: -5,
          height: 30,
        }}
        selectedItemLabelStyle={labelStyle}
        labelStyle={labelStyle}
        listItemLabelStyle={labelStyle}
        listItemContainerStyle={{ marginVertical: 10 }}
        placeholderStyle={labelStyle}
        placeholder='No devices selected'
        value={valueRef.current}
        setValue={setValueCb}
        items={listOptions}
        open={open}
        setOpen={setOpen}
        dropDownDirection='BOTTOM'
        multiple
        multipleText={
          value === 'all'
            ? ucFirst({ id: 'notifications.allDevicesSelected' })
            : ucFirst({ id: 'notifications.devicesSelected' })
        }
        searchable
        searchPlaceholder={ucFirst({ id: 'general.search' })}
        searchContainerStyle={{
          marginHorizontal: 10,
          padding: 2,
          height: 50,
        }}
        searchTextInputStyle={{
          fontSize: 15,
          height: 50,
          borderWidth: 0,
        }}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: actionColor }]}
          onPress={selectAll}
        >
          <Text style={styles.buttonText}>{ucFirst({ id: 'notifications.selectAllDevices' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ffc107' }]}
          onPress={selectNone}
        >
          <Text style={styles.buttonText}>
            {ucFirst({ id: 'notifications.unselectAllDevices' })}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectDevices;
