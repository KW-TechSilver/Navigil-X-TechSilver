import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Platform, Dimensions } from 'react-native';
import useFormatMessage from 'hooks/useFormatMessage';

const labelStyle = { fontSize: Platform.OS === 'ios' ? 15 : 17 };

const Dropdown = ({ value, setValue, items, style }) => {
  const { ucFirst } = useFormatMessage();
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      maxHeight={Dimensions.get('screen').height * 0.6}
      listMode={Platform.OS === 'android' ? 'MODAL' : 'SCROLLVIEW'}
      style={{
        backgroundColor: 'transparent',
        color: '#000',
        borderWidth: 0,
        borderRadius: 0,
        margin: 0,
        marginLeft: -8.5,
        width: '105%',
        padding: 0,
        height: 30,
        ...style,
      }}
      selectedItemLabelStyle={labelStyle}
      labelStyle={labelStyle}
      listItemLabelStyle={labelStyle}
      listItemContainerStyle={{
        backgroundColor: '#fafafa',
        color: '#000',
        justifyContent: 'flex-start',
        height: 50,
        zIndex: 100000,
      }}
      dropDownContainerStyle={{
        marginLeft: '-2%',
        width: '104%',
        borderColor: '#ccc',
        backgroundColor: '#fafafa',
        borderRadius: 0,
        borderWidth: 1,
      }}
      value={value}
      setValue={setValue}
      items={items}
      open={open}
      setOpen={setOpen}
      dropDownDirection='BOTTOM'
      placeholder={ucFirst({ id: 'general.selectDefault' })}
    />
  );
};

export default Dropdown;
