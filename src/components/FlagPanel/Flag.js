import React, { forwardRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import * as flags from './flags';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
  },
  flag: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
  },
});

const Flag = ({ language }, ref) => {
  // eslint-disable-next-line import/namespace
  const flag = flags[language];
  return (
    <View ref={ref} className='flagDiv' style={styles.flag}>
      <Image source={flag} height={17} width={23} />
    </View>
  );
};

export default forwardRef(Flag);
