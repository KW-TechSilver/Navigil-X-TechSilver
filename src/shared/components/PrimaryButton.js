import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { actionColor } from 'core/theme';

const styles = StyleSheet.create({
  primaryButton: {
    height: 50,
    backgroundColor: actionColor,
    borderColor: actionColor,
    borderRadius: 10,
    borderWidth: 1,
    margin: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryButtonContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const PrimaryButton = ({ children, onPress, style }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.primaryButton, style]}>
      <View style={styles.primaryButtonContainer}>{children}</View>
    </View>
  </TouchableOpacity>
);

export default PrimaryButton;
