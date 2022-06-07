import React from 'react';
import { AntDesign } from 'react-native-vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useHelp from 'hooks/useHelp';
import { SVG } from 'shared/components/WatchDashboard/constants';
import { useLastData } from 'shared/components/WatchDashboard/hooks';
import { getStatus } from 'shared/components/WatchDashboard/utils';

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' },
  textContent: {
    fontSize: 15,
    width: '100%',
    color: 'black',
    paddingRight: 18,
  },
  largeTextContent: {
    fontSize: 22,
    width: '100%',
    color: 'white',
  },
  iconContainer: {
    width: '15%',
  },
});

const TopBar = ({ data, type, helpLink }) => {
  const values = useLastData(data, null, false);
  const status = getStatus(values, type);
  const Svg = SVG[type];
  const { mainValue, mainUnit, textLines } = values;
  const backgroundColor =
    status === 'alarm' ? '#d32f2f' : status === 'warning' ? '#ffc107' : '#4caf50';

  const openHelp = useHelp(helpLink);

  return (
    <View style={styles.topBar}>
      <View
        style={{
          width: '30%',
          backgroundColor,
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
      >
        <View>
          <Svg width={30} height={30} fill='white' />
        </View>
        <View>
          <Text style={styles.largeTextContent}>
            {type !== 'beacon' && `${mainValue} ${mainUnit}`}
          </Text>
        </View>
      </View>
      <View style={{ width: '55%', paddingLeft: '5%' }}>
        <Text style={styles.textContent}>{textLines?.length ? textLines.join(' ') : ''}</Text>
      </View>
      <View
        style={{ width: '15%', flexdirection: 'row', alignItems: 'flex-end', paddingRight: 17 }}
      >
        <TouchableOpacity onPress={openHelp}>
          <AntDesign name='questioncircleo' size={21} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;
