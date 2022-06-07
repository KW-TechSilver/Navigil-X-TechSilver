import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 64,
    marginBottom: 12,
    resizeMode: 'contain',
  },
});

const Logo = ({ url }) => <Image source={url} style={styles.image} />;

export default memo(Logo);
