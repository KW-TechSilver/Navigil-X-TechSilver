import React, { useEffect, useCallback } from 'react';
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setSerialNumber, setDevicePickerOpen } from 'actions';
import useSelectedDevice from 'hooks/useSelectedDevice';
import useFormatMessage from 'hooks/useFormatMessage';

const selectDeviceLabel = (device, items, titles) => {
  const fnIndex = items.findIndex(item => item === 'firstName');
  const lnIndex = items.findIndex(item => item === 'lastName');
  const removeSeparator = fnIndex >= 0 && lnIndex >= 0 && Math.abs(fnIndex - lnIndex) === 1;
  let removeIndex = null;
  if (removeSeparator) {
    removeIndex = fnIndex < lnIndex ? fnIndex : lnIndex;
  }
  let label = '';
  items.forEach((item, index) => {
    label = `${titles ? titles[index] : ''}${label}${device[item]}${
      removeIndex !== index ? ' | ' : ' '
    }`;
  });
  label = label.substr(0, label.length - 3);
  return label;
};

const useSingleDevice = ({ deviceList, serialNumber }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (deviceList?.length === 1 && deviceList[0].serialNumber) {
      if (deviceList[0].serialNumber !== serialNumber) {
        dispatch(setSerialNumber(deviceList[0].serialNumber));
      }
    }
  }, [dispatch, deviceList, serialNumber]);
};

const selectDefaultItems = ['serialNumber', 'firstName', 'lastName', 'name'];

export const selectDeviceOptions = (
  deviceList,
  { valueType, labelItems = selectDefaultItems, labelTitles = null } = {}
) =>
  deviceList?.map(device => ({
    value: valueType ? device[valueType] : device.serialNumber,
    label: selectDeviceLabel(device, labelItems, labelTitles),
  }));

const SelectDevice = () => {
  const { ucFirst } = useFormatMessage();
  const dispatch = useDispatch();
  const device = useSelectedDevice();
  const [deviceList = [], { open }, serialNumber] = useSelector(state => [
    state.deviceList,
    state.devicePicker,
    state.serialNumber,
  ]);
  const deviceOptions = selectDeviceOptions(deviceList);

  const setOpen = useCallback(value => dispatch(setDevicePickerOpen(value)), [dispatch]);
  const changeSerialNumber = useCallback(
    selectedSerialNumber => {
      const _serialNumber = parseInt(selectedSerialNumber, 10);
      dispatch(setSerialNumber(_serialNumber));
    },
    [dispatch]
  );

  useSingleDevice({ deviceList, serialNumber });

  if (!(deviceOptions?.length > 1)) {
    return null;
  }

  return (
    <DropDownPicker
      maxHeight={Dimensions.get('screen').height * 0.65}
      items={deviceOptions.sort((a, b) => (a.label < b.label ? -1 : 1))}
      searchable
      open={open}
      setOpen={setOpen}
      listMode='FLATLIST'
      searchPlaceholder={ucFirst({ id: 'general.search' })}
      placeholder={ucFirst({ id: 'general.selectDevice' })}
      value={device?.serialNumber}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'always',
      }}
      flatListProps={{
        keyboardShouldPersistTaps: 'always',
      }}
      style={{
        backgroundColor: '#ffffff',
        shadowOpacity: 1,
        borderWidth: 0,
        elevation: 1,
        borderColor: '#000',
        borderRadius: 0,
        margin: 0,
        padding: 0,
        height: 50,
        fontSize: 15,
      }}
      placeholderStyle={{
        fontSize: 15,
      }}
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
      customItemLabelStyle={{ color: '#000', fontSize: 16 }}
      listItemContainerStyle={{
        backgroundColor: '#fafafa',
        color: '#000',
        justifyContent: 'flex-start',
        height: 50,
      }}
      dropDownContainerStyle={{
        borderColor: '#ccc',
        backgroundColor: '#fafafa',
        borderRadius: 0,
        borderWidth: 1,
        borderBottomColor: '#aaa',
      }}
      setValue={value => {
        changeSerialNumber(value());
      }}
    />
  );
};

export default SelectDevice;
