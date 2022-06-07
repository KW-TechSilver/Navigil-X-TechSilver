import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import useFormatMessage from 'hooks/useFormatMessage';
import { actionColor } from 'core/theme';

import Context from './context';
import { getDefaultRadius } from './utils';
import { MIN_RADIUS, MAX_RADIUS } from './constants';

const styles = StyleSheet.create({
  slider: {
    width: '90%',
    height: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    paddingTop: 10,
    backgroundColor: 'rgba(255,255,255,1)',
  },
});

const RadiusSlider = () => {
  const { ucFirst } = useFormatMessage();
  const { selected, editGeofence, showList } = useContext(Context);
  const region = useSelector(state => state.geofenceEditor.region);

  if (!region?.longitudeDelta || selected?.type !== 'circle' || showList) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ marginLeft: '6%' }}>
        {ucFirst({ id: 'geofenceEditor.radius' })}: {selected?.radius} m
      </Text>

      <Slider
        thumbTintColor='white'
        minimumTrackTintColor={actionColor}
        style={styles.slider}
        minimumValue={MIN_RADIUS}
        maximumValue={Math.max(MIN_RADIUS * 5, Math.min(getDefaultRadius(region) * 2, MAX_RADIUS))}
        value={selected.radius}
        onSlidingComplete={value => editGeofence({ ...selected, radius: Math.round(value) })}
      />
    </View>
  );
};

export default RadiusSlider;
