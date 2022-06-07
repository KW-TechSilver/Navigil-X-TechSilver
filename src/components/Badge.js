import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { isEmpty } from 'lodash';

import Paragraph from 'components/Paragraph';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 5,
    color: '#FFFFFF',
  },
  column1: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  column2: {
    width: '70%',
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  column3: {
    flexDirection: 'row',
  },
  badgeText: {
    margin: 2,
    color: '#fff',
    fontSize: 17,
  },
  badgeImage: {
    margin: 2,
    width: 45,
    height: 45,
  },
});

const parseColor = status => {
  switch (status) {
    case 'alert':
      return '#d32f2f';
    case 'warning':
      return '#ff9800';
    default:
      return '#4caf50';
  }
};

const Badge = ({ badge }) => {
  const { badgeProps, imageProps, imageComponent: Image } = badge;
  const { textLines = [], name, status, mainUnit, mainValue } = badgeProps;
  return (
    <View style={[styles.item, { backgroundColor: parseColor(status) }]}>
      <View style={styles.column1}>
        <Image {...imageProps} style={styles.badgeImage} />
        {!isEmpty(mainValue) && (
          <Paragraph fontSize={27} color='white' marginTop={16}>
            {mainValue} {mainUnit}
          </Paragraph>
        )}
      </View>
      <View style={styles.column2}>
        <Text style={styles.badgeText}>{name}</Text>
        <View style={styles.column3}>
          <Text style={styles.badgeText}>{textLines[0]},</Text>
          <Text style={styles.badgeText}>{textLines[1]}</Text>
        </View>
      </View>
    </View>
  );
};

export default Badge;
