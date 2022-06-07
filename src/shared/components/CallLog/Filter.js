import React, { useCallback, useEffect, useState } from 'react';
import TextInput from 'components/TextInput';
import useFormatMessage from 'hooks/useFormatMessage';
import useHelp from 'hooks/useHelp';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from 'react-native-vector-icons';

const CALL_LOG_HELP = '/call-log';

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  search: {
    width: '85%',
  },
  help: {
    width: '15%',
    alignItems: 'flex-end',
    paddingTop: 5,
    paddingRight: 15,
  },
});

const Filter = ({ deviceData, setFilteredData }) => {
  const { ucFirst } = useFormatMessage();
  const [text, setText] = useState();

  const filterTree = useCallback(
    (rows, filterValue) =>
      rows.filter(
        row => row.phoneNumber.includes(filterValue) || row.callDateAndTime.includes(filterValue)
      ),
    []
  );
  const openHelp = useHelp(CALL_LOG_HELP);

  useEffect(() => {
    if (text && deviceData) {
      setFilteredData(filterTree(deviceData, text));
    } else {
      setFilteredData(deviceData);
    }
  }, [deviceData, filterTree, setFilteredData, text]);

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <TextInput
          label={ucFirst({ id: 'general.search' })}
          mode='outlined'
          onChangeText={val => {
            setText(val.toLowerCase());
          }}
          style={{ height: 50 }}
          autoCapitalize='none'
        />
      </View>
      <View style={styles.help}>
        <View>
          <TouchableOpacity onPress={openHelp}>
            <AntDesign name='questioncircleo' size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Filter;
