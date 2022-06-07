import React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  top: {
    color: 'black',
    height: 0,
    backgroundColor: 'black',
    margin: 0,
    padding: 0,
    flex: 0,
  },
});

const SideBar = () => <Appbar.Header style={styles.top} />;

export default SideBar;
