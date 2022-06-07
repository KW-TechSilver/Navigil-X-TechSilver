import React, { useState, useMemo, useCallback } from 'react';
import { isEmpty } from 'lodash';
import { format } from 'date-fns';
import useFormatMessage from 'hooks/useFormatMessage';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  View,
  Text,
} from 'react-native';
import useMiddlewareAPI from 'hooks/useMiddlewareAPI';
import { getDeviceStatusThrow } from 'api/MiddlewareAPI';
import { createStackNavigator } from '@react-navigation/stack';
import { Card } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setSerialNumber } from 'actions';
import Battery from 'assets/svg/battery.svg';
import ExtPow from 'assets/svg/externalPowerConnected.svg';
import BatteryLow from 'assets/svg/batteryLow.svg';
import BatteryEmpty from 'assets/svg/batteryEmpty.svg';
import HelpIcon from 'shared/components/HelpIcon';
import Filter from './Filter';

const DEVICE_LIST_HELP = '/devices-list';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    margin: 5,
    paddingRight: 15,
  },
  itemAlarm: {
    backgroundColor: '#d32f2f',
    color: '#FFFFFF',
    margin: 5,
    paddingRight: 15,
  },
  itemWarning: {
    backgroundColor: '#ffa000',
    color: '#FFFFFF',
    margin: 5,
    paddingRight: 15,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textBlack: {
    color: 'black',
  },
  title: {
    fontSize: 32,
  },
  titleWhite: {
    color: '#FFFFFF',
    marginVertical: -30,
  },
  titleBlack: {
    color: '#000000',
    marginVertical: -30,
  },
  cardContent: {
    marginTop: -40,
    paddingBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginRight: -15,
  },
  batteryContent: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: -35,
  },
  buttons: {
    flexDirection: 'row',
    padding: 5,
    margin: 5,
    color: '#FFFFFF',
    justifyContent: 'flex-end',
  },
  column2: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  column3: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    fontSize: 30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  icon: {
    position: 'absolute',
    right: 0,
    margin: 40,
  },
  scrollView: {
    marginHorizontal: 10,
  },
  bold:
    Platform.OS === 'ios'
      ? {
          fontFamily: 'fontFamily',
          fontWeight: 'bold',
        }
      : {
          fontFamily: 'fontFamily-bold',
        },
});

const FULL = 80;
const NEAR_FULL = 60;
const LOW = 20;

const convertStatus = status => {
  let updateLatestStatus = status;
  switch (status) {
    case 'info-count':
      updateLatestStatus = 'info';
      return updateLatestStatus;
    case 'alarm-count':
      updateLatestStatus = 'alert';
      return updateLatestStatus;
    case 'warning-count':
      updateLatestStatus = 'warning';
      return updateLatestStatus;
    default:
      updateLatestStatus = 'info';
      return updateLatestStatus;
  }
};
const getUpdatedAlarm = (item, ucFirst) => {
  let updatedAlarm = null;
  if (!isEmpty(item) && item !== null && item.importantAlarm !== '') {
    const { importantAlarm, latestStatus } = item;
    updatedAlarm = ucFirst({
      id: `${convertStatus(latestStatus)}Message.${importantAlarm}`,
    }).toUpperCase();
  }
  return updatedAlarm;
};

const getFullName = item => {
  if (item) {
    return item.assisteeData.firstName.concat(' ', item.assisteeData.lastName);
  }
  return null;
};

const getSerialNumberAlarm = (item, ucFirst) => {
  if (!isEmpty(item)) {
    let snAlarm = '';
    if (getUpdatedAlarm(item, ucFirst) !== null) {
      snAlarm = getUpdatedAlarm(item, ucFirst);
    } else {
      snAlarm = '';
    }
    return snAlarm;
  }
  return null;
};

const getDateLatestStatus = item => {
  if (!isEmpty(item) && item !== null && item.statusUpdateTime !== null) {
    return item.statusUpdateTime.concat(' ', item.latestStatus);
  }
  return 'nothing'.concat(' ', item.latestStatus);
};

const changeLatestStatus = item => {
  let alertItem = item;
  if (item === 'alert') {
    alertItem = 'alarm';
  }
  return alertItem && alertItem.concat('-count');
};

const rowColor = status => {
  let bgColor = null;
  let batteryColor = 'black';
  let textColor = styles.textBlack;
  let titleColor = styles.titleBlack;
  switch (status) {
    case 'alarm-count':
      bgColor = styles.itemAlarm;
      batteryColor = 'white';
      textColor = styles.textWhite;
      titleColor = styles.titleWhite;
      break;
    case 'warning-count':
      bgColor = styles.itemWarning;
      batteryColor = 'white';
      textColor = styles.textWhite;
      titleColor = styles.titleWhite;
      break;
    default:
      bgColor = styles.item;
  }
  return { bgColor, batteryColor, textColor, titleColor };
};

const Item = ({ title, navigation, dispatch }) => {
  const { externalPower, percentage, serialNumber, latestStatus } = title;
  const { bgColor, batteryColor, textColor, titleColor } = rowColor(latestStatus);
  const batteryStatus = percentage;
  const RightContent = () => (
    <View style={styles.batteryContent}>
      {externalPower === 'extPwr' && <ExtPow width='50' height='50' fill={batteryColor} />}
      {batteryStatus > FULL ? (
        <Battery fill={batteryColor} width={50} height={50} class='level battery50' />
      ) : batteryStatus > NEAR_FULL ? (
        <Battery fill={batteryColor} width={50} height={50} />
      ) : batteryStatus > LOW ? (
        <BatteryLow fill={batteryColor} width={50} height={50} class='level battery50' />
      ) : (
        <BatteryEmpty fill={batteryColor} width={50} height={50} />
      )}
    </View>
  );
  const navigationCb = useCallback(() => {
    dispatch(setSerialNumber(serialNumber));
    navigation.navigate('Dashboard');
  }, [dispatch, navigation, serialNumber]);

  return (
    <Card style={bgColor}>
      <TouchableOpacity onPress={navigationCb}>
        <Card.Title title={title.fullName} right={RightContent} titleStyle={titleColor} />
        <Card.Content>
          <View style={styles.cardContent}>
            <View style={styles.row}>
              <Text style={textColor}> +{title.phoneNumber} </Text>
              <Text style={textColor}> {title.serialNumber} </Text>
            </View>
            {!isEmpty(title.serialNumberAlarm) ? (
              <Text style={textColor}> {title.serialNumberAlarm} </Text>
            ) : null}
            <Text style={textColor}> {title.date} </Text>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

const App = ({ navigation }) => {
  const dispatch = useDispatch();
  const { ucFirst } = useFormatMessage();
  const [filteredData, setFilteredData] = useState([]);
  const [text, setText] = useState('');
  const [fetchedData] = useMiddlewareAPI({ function: [getDeviceStatusThrow], spinner: false }, []);

  const deviceData = useMemo(() => {
    const makeDeviceData = () => {
      if (fetchedData !== undefined && fetchedData !== null) {
        const updateFetchData =
          fetchedData &&
          fetchedData.body.map(fData => ({
            ...fData,
            latestStatus: changeLatestStatus(fData.latestStatus),
          }));

        return Object.values(updateFetchData).map(item => ({
          firstName: item.assisteeData.firstName,
          lastName: item.assisteeData.lastName,
          fullName: getFullName(item),
          statusDate: getDateLatestStatus(item),
          serialNumberAlarm: getSerialNumberAlarm(item, ucFirst),
          date: format(new Date(item.statusUpdateTime * 1000), 'yyyy-MM-dd HH:mm:ss'),
          sim: 'sim:'.concat(item.simOperator),
          alarmStatus: item.latestStatus,
          statusKey: item.status && item.status.map(row => row.severity.concat('-count')),
          warningMessages: item.status && item.status.map(row => row.type),
          ...item,
        }));
      }
      return [];
    };
    return makeDeviceData();
  }, [fetchedData, ucFirst]);

  const renderItem = ({ item }) => (
    <Item title={item} navigation={navigation} dispatch={dispatch} />
  );
  return (
    <SafeAreaView>
      <Filter
        text={text}
        setText={setText}
        deviceData={deviceData}
        setFilteredData={setFilteredData}
      />
      <FlatList
        style={{ marginBottom: 80 }}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

const Container = () => {
  const { ucFirst } = useFormatMessage();

  const getHelp = useCallback(() => <HelpIcon url={DEVICE_LIST_HELP} />, []);

  return (
    <Stack.Navigator initialRouteName='devicesList'>
      <Stack.Screen
        name='devicesList'
        component={App}
        options={{ title: ucFirst({ id: 'deviceMenu.devices' }), headerRight: getHelp }}
      />
    </Stack.Navigator>
  );
};

export default Container;
