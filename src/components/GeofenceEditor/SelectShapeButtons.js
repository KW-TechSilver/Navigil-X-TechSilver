import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useFormatMessage from 'hooks/useFormatMessage';
import PrimaryButton from 'shared/components/PrimaryButton';

import Context from './context';

const styles = StyleSheet.create({
  container: {
    width: '45%',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 50,
    borderWidth: 0,
    borderRadius: 30,
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: 0.5,
    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
  },
});

const Button = ({ type, shape, setShape, ucFirst }) => (
  <View style={styles.container}>
    <PrimaryButton
      onPress={() => setShape(type)}
      style={[styles.button, shape !== type && { backgroundColor: 'white' }]}
    >
      <Text style={{ color: shape === type ? 'white' : 'black', fontSize: 18 }}>
        {ucFirst({ id: `general.${type}` })}
      </Text>
    </PrimaryButton>
  </View>
);

const SelectShapeButtons = () => {
  const { ucFirst } = useFormatMessage();

  return (
    <Context.Consumer>
      {({ setShape, shape }) => (
        <View style={styles.flexContainer}>
          <Button type='polygon' shape={shape} setShape={setShape} ucFirst={ucFirst} />
          <Button type='circle' shape={shape} setShape={setShape} ucFirst={ucFirst} />
        </View>
      )}
    </Context.Consumer>
  );
};

export default SelectShapeButtons;
