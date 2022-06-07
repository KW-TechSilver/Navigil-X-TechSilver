import React from 'react';
import { View } from 'react-native';
import TextInput from 'components/TextInput';
import useFormatMessage from 'hooks/useFormatMessage';
import useDebounceFunction from 'hooks/useDebounceFunction';

const Filter = ({ setText }) => {
  const { ucFirst } = useFormatMessage();
  const debouncedSetText = useDebounceFunction(setText, 100);

  return (
    <View style={{ margin: 5 }}>
      <TextInput
        label={ucFirst({ id: 'general.search' })}
        mode='outlined'
        onChangeText={val => {
          debouncedSetText(val.toLowerCase());
        }}
        autoCapitalize='none'
        style={{ height: 50 }}
      />
    </View>
  );
};

export default Filter;
