import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import _ from 'lodash';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import usePagePermissions from 'hooks/usePagePermissions';
import useSpinner from 'hooks/useSpinner';
import { FontAwesome, MaterialCommunityIcons } from 'react-native-vector-icons';
import useFormatMessage from 'hooks/useFormatMessage';
import HeartRate from 'assets/svg/heartRate.svg';
import Activity from 'assets/svg/activity.svg';
import Activity24h from 'assets/svg/activity24h.svg';
import RespiratoryRate from 'assets/svg/respiratoryRate.svg';
import SignalStrength from 'assets/svg/network.svg';
import HomeBeacon from 'assets/svg/homeBeacon.svg';
import HeartRateVariability from 'assets/svg/heartRateVariability.svg';
import { toggleDatePicker } from 'actions';
import { actionColor } from 'core/theme';
import useDeviceId from 'hooks/useDeviceId';
import SelectDevice from 'components/SelectDevice';
import AreaWithBarsChart from 'components/Charts/AreaWithBarsChart';
import ActivityBinnedChart from 'components/Charts/ActivityBinnedChart';
import SignalStrengthChart from 'components/Charts/SignalStrengthChart';
import BeaconChart from 'components/Charts/BeaconCharts';
import BatteryAreaChart from 'components/Charts/BatteryAreaChart';
import HelpIcon from 'shared/components/HelpIcon';

import { useChartsData, useLastData } from './hooks';
import { getStatus } from './utils';
import {
  SVG,
  MAIN,
  ACTIVITY,
  BATTERY,
  HEART_RATE,
  ACTIVITY_24H,
  RESPIRATORY_RATE,
  BEACON,
  SIGNAL_STRENGTH,
  HRV,
} from './constants';

const CHARTS_HELP = '/watch-dashboard#WatchDashboard-Charts';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 19,
    width: '50%',
    marginLeft: '3%',
  },
  buttonArrow: {
    fontSize: 25,
    alignSelf: 'center',
  },
  navigationList: {
    marginBottom: 5,
  },
  indicator: {
    backgroundColor: '#4caf50',
    width: '40%',
    paddingVertical: 5,
    height: 60,
  },
  indicatorRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  indicatorContent: {
    fontSize: 30,
    width: '40%',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  beaconIndicatorContent: {
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
  },
  textContent: {
    fontSize: 23,
    paddingRight: 10,
    textAlign: 'right',
    width: '100%',
    color: 'white',
  },
  textContentSmall: {
    fontSize: 14,
    paddingRight: 10,
    textAlign: 'right',
    width: '100%',
    color: 'white',
    paddingTop: 3,
  },
  textContentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '60%',
  },
});

const getBatteryIcon = ({ percentage }) => {
  if (percentage >= 75) {
    return 'battery-4';
  }
  if (percentage >= 50) {
    return 'battery-3';
  }
  if (percentage >= 15) {
    return 'battery-2';
  }
  if (percentage > 0) {
    return 'battery-1';
  }
  return 'battery-0';
};

const SmallTextContent = ({ values: { textLines } }) => {
  const smallContent = textLines?.length ? textLines.join(' ') : '';
  return <Text style={styles.textContentSmall}>{smallContent}</Text>;
};

const TextContent = ({ values }) => {
  const { mainValue, mainUnit } = values;
  return (
    <View style={styles.textContentContainer}>
      <Text style={styles.textContent}>{`${mainValue} ${mainUnit}`}</Text>
    </View>
  );
};

const BatteryIndicator = ({ device, values, status }) => {
  const iconName = getBatteryIcon(device);
  return (
    <View
      style={styles.indicator}
      backgroundColor={
        status === 'alarm' ? '#d32f2f' : status === 'warning' ? '#ffc107' : '#4caf50'
      }
    >
      <View style={styles.indicatorRow}>
        <View style={styles.indicatorContent}>
          <FontAwesome style={{ fontSize: 30 }} name={iconName} color='white' />
        </View>
        <TextContent values={values} />
      </View>
      <View style={styles.indicatorRow}>
        <SmallTextContent values={values} />
      </View>
    </View>
  );
};

const ActivityIndicator = ({ values, status }) => (
  <View
    style={styles.indicator}
    backgroundColor={status === 'alarm' ? '#d32f2f' : status === 'warning' ? '#ffc107' : '#4caf50'}
  >
    <View style={styles.indicatorRow}>
      <View style={styles.indicatorContent}>
        <Activity24h width={30} height={30} fill='white' />
      </View>
      <TextContent values={values} />
    </View>
    <View style={styles.indicatorRow}>
      <SmallTextContent values={values} />
    </View>
  </View>
);
const HeartRateIndicator = ({ values, status }) => (
  <View
    style={styles.indicator}
    backgroundColor={status === 'alarm' ? '#d32f2f' : status === 'warning' ? '#ffc107' : '#4caf50'}
  >
    <View style={styles.indicatorRow}>
      <View style={styles.indicatorContent}>
        <HeartRate width={30} height={30} fill='white' />
      </View>
      <TextContent values={values} />
    </View>
    <View style={styles.indicatorRow}>
      <SmallTextContent values={values} />
    </View>
  </View>
);
const HeartRateVariabilityIndicator = ({ values, status }) => (
  <View
    style={styles.indicator}
    backgroundColor={status === 'alarm' ? '#d32f2f' : status === 'warning' ? '#ffc107' : '#4caf50'}
  >
    <View style={styles.indicatorRow}>
      <View style={styles.indicatorContent}>
        <HeartRateVariability width={30} height={30} fill='white' />
      </View>
      <TextContent values={values} />
    </View>
    <View style={styles.indicatorRow}>
      <SmallTextContent values={values} />
    </View>
  </View>
);
const Activity24hIndicator = ({ values, status }) => (
  <View
    style={styles.indicator}
    backgroundColor={status === 'alarm' ? '#d32f2f' : status === 'warning' ? '#ffc107' : '#4caf50'}
  >
    <View style={styles.indicatorRow}>
      <View style={styles.indicatorContent}>
        <Activity width={30} height={30} fill='white' />
      </View>
      <TextContent values={values} />
    </View>
    <View style={styles.indicatorRow}>
      <SmallTextContent values={values} />
    </View>
  </View>
);
const RespiratoryRateIndicator = ({ values, status }) => (
  <View
    style={styles.indicator}
    backgroundColor={status === 'alarm' ? '#d32f2f' : status === 'warning' ? '#ffc107' : '#4caf50'}
  >
    <View style={styles.indicatorRow}>
      <View style={styles.indicatorContent}>
        <RespiratoryRate width={30} height={30} fill='white' />
      </View>
      <TextContent values={values} />
    </View>
    <View style={styles.indicatorRow}>
      <SmallTextContent values={values} />
    </View>
  </View>
);
const BeaconIndicator = () => (
  <View style={styles.indicator} backgroundColor='#4caf50'>
    <View style={styles.beaconIndicatorContent}>
      <HomeBeacon height={50} width={30} fill='white' />
    </View>
  </View>
);
const SignalStrengthIndicator = ({ values, status }) => (
  <View
    style={styles.indicator}
    backgroundColor={status === 'alarm' ? '#d32f2f' : status === 'warning' ? '#ffc107' : '#4caf50'}
  >
    <View style={styles.indicatorRow}>
      <View style={styles.indicatorContent}>
        <SignalStrength width={30} height={30} fill='white' />
      </View>
      <TextContent values={values} />
    </View>
    <View style={styles.indicatorRow}>
      <SmallTextContent values={values} />
    </View>
  </View>
);

const capitalizeFLetter = str => str[0].toUpperCase() + str.slice(1);

const Navigation = ({ navigation, device, values, type, status, batteryStatus }) => {
  if (!device) {
    return null;
  }
  return (
    <View style={styles.navigationList}>
      <Item
        item={type}
        navigation={navigation.navigation}
        device={device}
        values={values}
        type={type}
        status={status}
        batteryStatus={batteryStatus}
      />
    </View>
  );
};

const Item = ({ navigation, device, values, type, status, batteryStatus }) => {
  const { ucFirst } = useFormatMessage();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('general.'.concat('', type))}>
      <View style={styles.button}>
        {type === 'battery' && (
          <BatteryIndicator
            device={device}
            values={values}
            status={status}
            batteryStatus={batteryStatus}
          />
        )}
        {type === 'activity' && <ActivityIndicator values={values} status={status} />}
        {type === 'heartRate' && <HeartRateIndicator values={values} status={status} />}
        {type === 'hrv' && (
          <HeartRateVariabilityIndicator
            device={device}
            values={values}
            status={status}
            batteryStatus={batteryStatus}
          />
        )}
        {type === 'respiratoryRate' && <RespiratoryRateIndicator values={values} status={status} />}
        {type === 'activeVeryActive' && <Activity24hIndicator values={values} status={status} />}
        {type === 'signalStrength' && <SignalStrengthIndicator values={values} status={status} />}
        {type === 'beacons' && <BeaconIndicator values={values} status={status} />}

        <Text style={styles.buttonText}>{ucFirst({ id: `general.${type}` })}</Text>
        <MaterialCommunityIcons style={styles.buttonArrow} name='chevron-right' />
      </View>
    </TouchableOpacity>
  );
};

const ChartRow = ({ chartProps: { data, type }, device, navigation }) => {
  const [status, setStatus] = useState('');
  const Svg = useMemo(() => SVG?.[type], [type]);

  const noTime = type === 'activeVeryActive' || type === 'activity';
  const values = useLastData(data, null, noTime);

  useEffect(() => {
    setStatus(getStatus(values, type));
  }, [values, type]);

  const batteryStatus = type === 'battery' ? parseInt(values.mainValue, 10) : null;

  return (
    <Navigation
      device={device}
      navigation={navigation}
      values={values}
      type={type}
      status={status}
      batteryStatus={batteryStatus}
      Svg={Svg}
    />
  );
};

const DashboardMain = ({ navigation, chartsFiltered, fetchFunctions }) => {
  const { deviceList } = useSelector(state => ({ deviceList: state.deviceList }));
  const deviceId = useDeviceId();
  const spinner = useSpinner();
  const device = deviceList?.find(x => x.deviceId === deviceId);

  const fetchFunctionsRef = useRef(fetchFunctions);
  fetchFunctionsRef.current = fetchFunctions;

  const onRefresh = useCallback(async () => {
    const id = spinner.show();
    await Promise.all(_.map(fetchFunctionsRef.current, f => f()));
    spinner.hide(id);
  }, [spinner]);

  return (
    <View>
      <SelectDevice />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={false} />}
      >
        <View style={{ marginBottom: 50 }}>
          {chartsFiltered.length &&
            chartsFiltered.map(
              ({ key, type, chartProps, RowComponent = ChartRow, ...rest } = {}) => (
                <RowComponent
                  device={device}
                  navigation={navigation}
                  key={key}
                  type={type}
                  {...rest}
                  chartProps={{
                    type,
                    unit: '',
                    fetchData: () =>
                      fetchFunctions[`fetch${capitalizeFLetter(chartProps.type)}Data`]({
                        umwapi: {
                          snackbarReports: true,
                        },
                      }),
                    ...chartProps,
                  }}
                />
              )
            )}
        </View>
      </ScrollView>
    </View>
  );
};

const Stack = createStackNavigator();

const Charts = ({ route }) => {
  const { ucFirst } = useFormatMessage();
  const permissions = usePagePermissions('watchDashboard');
  const currentScreen = getFocusedRouteNameFromRoute(route) ?? MAIN;

  const dispatch = useDispatch();
  const toggleDatePickerCb = useCallback(() => dispatch(toggleDatePicker()), [dispatch]);
  const { fetchRange } = useSelector(store => ({
    fetchRange: store.fetchRange.charts,
  }));
  const {
    activityBinnedData,
    activityPercentageData,
    batteryData,
    beaconData,
    heartRateData,
    hrvData,
    signalStrengthData,
    respiratoryRateData,
    activityBinBy,
    beaconBinBy,
    setActivityBinBy,
    setBeaconBinBy,
    ...fetchFunctions
  } = useChartsData({ fetchRange, currentScreen });

  const getCalendarButton = useCallback(
    () => (
      <TouchableOpacity onPress={toggleDatePickerCb}>
        <MaterialCommunityIcons
          name='calendar-today'
          size={30}
          color={actionColor}
          style={{ marginRight: 15, marginTop: 3 }}
          onPress={toggleDatePickerCb}
        />
      </TouchableOpacity>
    ),
    [toggleDatePickerCb]
  );

  const charts = useMemo(
    () =>
      [
        {
          key: 'battery',
          chartProps: {
            type: 'battery',
            helpLink: '/watch-dashboard/battery-status',
            chartComponent: AreaWithBarsChart,
            unit: '%',
            data: batteryData,
          },
        },
        {
          key: 'activity',
          chartProps: {
            type: 'activity',
            helpLink: '/watch-dashboard/activity-goal',
            chartComponent: AreaWithBarsChart,
            unit: '%',
            data: activityPercentageData,
          },
        },

        {
          key: 'heartRate',
          chartProps: {
            type: 'heartRate',
            helpLink: '/watch-dashboard/resting-heart-rate',
            chartComponent: AreaWithBarsChart,
            unit: '/min',
            data: heartRateData,
            fixedBottom: 30,
            barSize: 1,
          },
        },
        {
          key: 'respiratoryRate',
          chartProps: {
            type: 'respiratoryRate',
            helpLink: '/watch-dashboard/respiratory-rate',
            chartComponent: AreaWithBarsChart,
            unit: '',
            barSize: 1,
            data: respiratoryRateData,
          },
        },
        {
          key: 'hrv',
          chartProps: {
            type: 'hrv',
            barSize: 1,
            helpLink: '/watch-dashboard/heart-rate-variability',
            chartComponent: AreaWithBarsChart,
            unit: '',
            data: hrvData,
          },
        },
        {
          key: 'activeVeryActive',
          chartProps: {
            type: 'activeVeryActive',
            helpLink: '/watch-dashboard/active-vs-very-active-days',
            chartComponent: AreaWithBarsChart,
            unit: '',
            data: activityBinnedData,
            binBy: activityBinBy,
            setBinBy: setActivityBinBy,
          },
        },
        {
          key: 'signalStrength',
          chartProps: {
            type: 'signalStrength',
            chartComponent: AreaWithBarsChart,
            unit: 'dB',
            data: signalStrengthData,
          },
        },
        {
          key: 'beacons',
          chartProps: {
            type: 'beacons',
            chartComponent: AreaWithBarsChart,
            unit: 'dB',
            data: beaconData,
          },
        },
      ].filter(({ chartProps: { type } }) => permissions?.[type] !== false),
    [
      batteryData,
      activityPercentageData,
      heartRateData,
      respiratoryRateData,
      hrvData,
      activityBinnedData,
      activityBinBy,
      setActivityBinBy,
      signalStrengthData,
      beaconData,
      permissions,
    ]
  );

  const getChartsHelp = useCallback(() => <HelpIcon url={CHARTS_HELP} />, []);

  if (!respiratoryRateData && !heartRateData && !activityBinnedData && !activityPercentageData) {
    return null;
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={MAIN}
        options={{ title: ucFirst({ id: MAIN }), headerRight: getChartsHelp }}
      >
        {nav => (
          <DashboardMain navigation={nav} chartsFiltered={charts} fetchFunctions={fetchFunctions} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={HEART_RATE}
        options={{
          title: ucFirst({ id: HEART_RATE }),
          headerRight: getCalendarButton,
        }}
      >
        {nav => (
          <AreaWithBarsChart
            data={heartRateData}
            nav={nav}
            title={ucFirst({ id: HEART_RATE })}
            chartType='heartRate'
            helpLink='/watch-dashboard/resting-heart-rate'
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={HRV}
        options={{
          title: ucFirst({ id: HRV }),
          headerRight: getCalendarButton,
        }}
      >
        {nav => (
          <AreaWithBarsChart
            data={hrvData}
            nav={nav}
            title={ucFirst({ id: HRV })}
            barPercent={0.01}
            chartWidth={4500}
            chartType='hrv'
            helpLink='/watch-dashboard/heart-rate-variability'
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name={BATTERY}
        options={{ title: ucFirst({ id: BATTERY }), headerRight: getCalendarButton }}
      >
        {nav => (
          <BatteryAreaChart
            data={batteryData}
            nav={nav}
            helpLink='/watch-dashboard/battery-status'
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={RESPIRATORY_RATE}
        options={{ title: ucFirst({ id: RESPIRATORY_RATE }), headerRight: getCalendarButton }}
      >
        {nav => (
          <AreaWithBarsChart
            data={respiratoryRateData}
            nav={nav}
            barPercent={0.7}
            chartWidth={500}
            title={ucFirst({ id: RESPIRATORY_RATE })}
            chartType='respiratoryRate'
            helpLink='/watch-dashboard/respiratory-rate'
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name={ACTIVITY_24H}
        options={{ title: ucFirst({ id: ACTIVITY_24H }), headerRight: getCalendarButton }}
      >
        {nav => (
          <SignalStrengthChart
            data={activityPercentageData}
            nav={nav}
            chartType='activity'
            title={ucFirst({ id: ACTIVITY_24H })}
            helpLink='/watch-dashboard/activity-goal'
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name={ACTIVITY}
        options={{ title: ucFirst({ id: ACTIVITY }), headerRight: getCalendarButton }}
      >
        {nav => (
          <ActivityBinnedChart
            data={activityBinnedData}
            nav={nav}
            chartType='activityBinned'
            title={ucFirst({ id: ACTIVITY })}
            helpLink='/watch-dashboard/active-vs-very-active-days'
            binBy={activityBinBy}
            setBinBy={setActivityBinBy}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={BEACON}
        options={{ title: ucFirst({ id: BEACON }), headerRight: getCalendarButton }}
      >
        {nav => (
          <BeaconChart
            data={beaconData}
            nav={nav}
            chartType='beaconChart'
            title={ucFirst({ id: BEACON })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={SIGNAL_STRENGTH}
        options={{ title: ucFirst({ id: SIGNAL_STRENGTH }), headerRight: getCalendarButton }}
      >
        {nav => (
          <SignalStrengthChart
            data={signalStrengthData}
            nav={nav}
            chartType='signalStrength'
            title={ucFirst({ id: BEACON })}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default Charts;
