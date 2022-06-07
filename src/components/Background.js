/* eslint-disable import/no-dynamic-require */
import React, { memo } from 'react';
import { sample } from 'lodash';

import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Background = ({ children, domain, bgImageData }) => {
  const bgImage = sample(bgImageData);
  const image = { uri: 'https://'.concat(domain).concat(bgImage) };

  return (
    <ImageBackground source={image} style={styles.background}>
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default memo(Background);
