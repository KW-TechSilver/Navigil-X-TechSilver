import React from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 50,
  },
  // inner container is necessary on Android due to a react-native bug:
  // https://github.com/facebook/react-native/issues/18415#issuecomment-383081951
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    height: '100%',
  },
  spinner: {
    marginTop: Dimensions.get('screen').height * 0.3,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 50,
  },
});

export default function Spinner() {
  const {
    spinner: { visible },
  } = useSelector(store => ({ spinner: store.spinner }));

  return (
    <View pointerEvents='none' style={styles.container}>
      <View style={[styles.innerContainer, visible ? {} : { display: 'none' }]}>
        <ActivityIndicator size='large' style={styles.spinner} color='grey' />
      </View>
    </View>
  );
}
