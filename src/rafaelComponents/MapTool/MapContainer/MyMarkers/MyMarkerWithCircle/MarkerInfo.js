import React, { useMemo, useState } from 'react';
import { Callout, CalloutSubview } from 'react-native-maps';
import { useSelector } from 'react-redux';
import useFormatMessage from 'hooks/useFormatMessage';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { Card, Paragraph } from 'react-native-paper';
import { format } from 'date-fns';
import Battery from 'assets/svg/battery.svg';
import ChargerDisconnected from 'assets/svg/chargerDisconnected.svg';
import EmergencyMarker from 'assets/svg/emergencyMarker.svg';
import EmergencyTrackingOn from 'assets/svg/emergencyTrackingOn.svg';
import EmergencyCallMarker from 'assets/svg/emergencyCallMarker.svg';
import ExternalPowerConnected from 'assets/svg/externalPowerConnected.svg';
import GeofenceAlarm from 'assets/svg/geofenceAlarm.svg';
import HomeBeacon from 'assets/svg/homeBeacon.svg';
import HomeBeaconRangeExit from 'assets/svg/homeBeaconRangeExit.svg';
import LocationMarkerDefault from 'assets/svg/locationMarkerDefault.svg';
import ManDown from 'assets/svg/manDown.svg';
import NoMovement from 'assets/svg/noMovement.svg';
import ProhibitedAreaEnter from 'assets/svg/prohibitedAreaEnter.svg';
import ProhibitedAreaExit from 'assets/svg/prohibitedAreaExit.svg';
import { deAdjustCoordinateTime } from 'rafaelComponents/MapTool/Utils/Utils';

const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'red',
  },
  pinText: {
    textAlign: 'center',
    fontSize: 0,
    marginBottom: 10,
  },
  row: {
    marginTop: 10,
  },
  button: {
    width: 100,
    height: 30,
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 3,
    borderColor: 'red',
    backgroundColor: 'green',
    overflow: 'hidden',
    elevation: 1,
  },
  addressButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,

    borderRadius: 4,
    elevation: 1,
    backgroundColor: '#2196f3',
    width: 270,
  },
  andriondAddressButton: {
    width: 300,
    height: 30,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 3,
    borderColor: 'red',
    backgroundColor: '#2196f3',
    overflow: 'hidden',
  },
  cardStyle: {
    width: 300,
  },
});

const UNSPECIFIED = '0';
const INITIAL = '1';
const FIRST = '2';
const FILTERED = '3';
const FINAL = '4';
const FAILED = '9';
const EMERGENCY_TRACKING = '10';

export const emergencyPositionTypes = {
  UNSPECIFIED,
  INITIAL,
  FIRST,
  FILTERED,
  FINAL,
  FAILED,
  EMERGENCY_TRACKING,
};

const iconColors = {
  default: {
    default: 'orange',
  },
  beacon: {
    default: 'teal',
    green: 'green',
    yellow: 'yellow',
    red: 'red',
  },
  cell: {
    default: 'white',
  },
  last: {
    default: 'red',
  },
  emergency: {
    [INITIAL]: 'orange',
    [FIRST]: 'yellow',
    [FILTERED]: 'yellow',
    [FINAL]: 'green',
    [FAILED]: 'red',
    [EMERGENCY_TRACKING]: 'red',
  },
};

const ICONS = {
  0: {
    langCode: 'statustrigger.timedStatusUpdate',
    icon: LocationMarkerDefault,
  },
  1: { langCode: 'statustrigger.external', icon: LocationMarkerDefault },
  2: { langCode: 'statustrigger.homebeaconIn', icon: EmergencyMarker },
  3: { langCode: 'statustrigger.homebeaconOut', icon: HomeBeaconRangeExit },
  4: { langCode: 'statustrigger.batteryLow', icon: Battery },
  5: { langCode: 'statustrigger.batteryOk', icon: Battery },
  6: {
    langCode: 'statustrigger.externalPowerConnected',
    icon: ExternalPowerConnected,
  },
  8: {
    langCode: 'statustrigger.externalPowerDisconnected',
    icon: ChargerDisconnected,
  },
  9: { langCode: 'statustrigger.SOSCallStarted', icon: EmergencyCallMarker },
  11: { langCode: 'statustrigger.batteryFull', icon: Battery },
  12: { langCode: 'statustrigger.manDown', icon: ManDown },
  13: { langCode: 'statustrigger.noMovement', icon: NoMovement },
  15: { langCode: 'statustrigger.SOSRequestSilent', icon: EmergencyMarker },
  16: { langCode: 'statustrigger.beaconAreaAlarm', icon: ProhibitedAreaEnter },
  17: {
    langCode: 'statustrigger.beaconAreaAlarmEnd',
    icon: ProhibitedAreaExit,
  },
  18: {
    langCode: 'statustrigger.internalTrigger',
    icon: LocationMarkerDefault,
  },
  256: { langCode: 'statustrigger.homebeaconLoss', icon: EmergencyMarker },
  257: {
    langCode: 'statustrigger.emergencyTracking',
    icon: EmergencyTrackingOn,
  },
  999: { langCode: 'statustrigger.undefined', icon: LocationMarkerDefault },
  1000: { langCode: 'statustrigger.safezoneOut', icon: GeofenceAlarm },
};

const getProps = positionTrigger => {
  let props;
  switch (positionTrigger) {
    case '4':
      props = { status: 21 };
      break;
    case '5':
      props = { status: 50 };
      break;
    case '11':
      props = { status: 100 };
      break;

    default:
      props = {};
      break;
  }
  return props;
};

const getIcon = (_type, { positionTrigger, emergencyPositionType }) => {
  const type =
    positionTrigger !== null
      ? 'positionTrigger'
      : emergencyPositionType !== '0'
      ? emergencyPositionType
      : _type;
  let Icon;

  switch (type) {
    case 'positionTrigger':
      Icon = ICONS?.[positionTrigger]?.icon || LocationMarkerDefault;
      break;
    case 'beacon':
      Icon = HomeBeacon;
      break;
    case 'Emergency tracking report':
      Icon = EmergencyTrackingOn;
      break;
    case 'sosCallStarted':
    case 'Initial report':
    case 'Positioning failed':
    case 'First fix':
    case 'Filtered fix':
    case 'Final position report':
      Icon = EmergencyCallMarker;
      break;
    default:
      Icon = LocationMarkerDefault;
      break;
  }
  return Icon;
};
Geocoder.init('AIzaSyDDrJCKwkXTtY-cpFypQ3Lf9KzDtbABxqg');
const MarkerInfo = ({
  coordinates,
  labelText,
  lat,
  lng,
  setShowSignalLevels,
  showSignalLevels,
  iconType,
  iconStyle,
}) => {
  const { networkSignalLevel, positionTrigger } = coordinates;
  const { lookupTables = {} } = useSelector(state => state.serviceSettings);
  const { statusTriggerLUT = [] } = lookupTables;
  const { ucFirst, formatMessage } = useFormatMessage();
  const [address, setAddress] = useState(true);
  const [currentAddress, setCurrentAddress] = useState();
  const MarkerType = getIcon(iconType, coordinates);
  const markerDate = useMemo(() => new Date(coordinates.locationData.date2).getTime(), [
    coordinates,
  ]);
  const buttonText = showSignalLevels
    ? ucFirst({ id: 'general.hide' })
    : ucFirst({ id: 'general.show' });

  const milliSecondsAgo = new Date().getTime() - deAdjustCoordinateTime(coordinates) * 1000;
  const markerTimeAgo = useMemo(() => {
    const timeAgo = [
      Math.floor(milliSecondsAgo / (24 * 60 * 60 * 1000)),
      Math.floor((milliSecondsAgo % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
      Math.floor((milliSecondsAgo % (60 * 60 * 1000)) / (60 * 1000)),
    ];
    let result = '';
    timeAgo.forEach((item, index) => {
      if (item > 0) result += `${item}${index === 0 ? 'd ' : index === 1 ? 'h ' : 'min '}`;
    });
    result +=
      result.length === 0
        ? formatMessage({ id: 'rafaelMaps.current' })
        : formatMessage({ id: 'rafaelMaps.ago' });
    return result;
  }, [milliSecondsAgo, formatMessage]);

  const triggerText = statusTriggerLUT.find(({ code }) => `${code}` === positionTrigger)?.langCode;

  const translatedTriggerText = triggerText ? ucFirst({ id: triggerText }) : undefined;

  const RightContent = () => (
    <View style={{ alignItems: 'center', textAlign: 'center', marginTop: 10 }}>
      <MarkerType
        {...getProps(positionTrigger)}
        width={40}
        height={40}
        fill={iconColors?.[iconType]?.[iconStyle] || ''}
      />
      <Text style={{ width: 100, textAlign: 'center' }}>{translatedTriggerText}</Text>
      {Platform.OS === 'ios' ? (
        <CalloutSubview
          style={styles.button}
          onPress={() => {
            setShowSignalLevels(!showSignalLevels);
          }}
        >
          <Text style={{ paddingTop: 5, color: 'white' }}>{buttonText}</Text>
        </CalloutSubview>
      ) : (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowSignalLevels(!showSignalLevels);
            }}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          >
            <Text style={{ paddingTop: 5, color: 'white' }}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  const getAddress = (currentlat, currentlng) => {
    Geocoder.from(currentlat, currentlng)
      .then(json => {
        const addressComponent = json.results[0].address_components;
        setCurrentAddress(
          addressComponent[0].long_name
            .concat(' ', addressComponent[1].long_name)
            .concat(',', addressComponent[2].long_name)
        );
      })
      .catch(error => console.warn(error));
  };
  return (
    <Callout
      style={styles.cardStyle}
      onPress={() => Platform.OS === 'android' && setShowSignalLevels(!showSignalLevels)}
    >
      <Card>
        <Card.Title
          title={
            <Text>
              {ucFirst({ id: 'rafaelMaps.marker' })} {labelText}
            </Text>
          }
          right={RightContent}
          style={{ margin: 0, padding: 0 }}
        />
        <Card.Content>
          <Paragraph>
            {markerTimeAgo}
            {'\n'}
            {format(markerDate, 'dd.M. HH:mm')}
            {'\n'}
            {ucFirst({ id: 'watchDashboard.networkSignal' })}: {networkSignalLevel}
            {'\n'}
            {Platform.OS === 'ios' && (
              <View style={styles.row}>
                {address && (
                  <Card.Actions>
                    <View
                      style={{
                        alignSelf: 'center',
                      }}
                    >
                      <CalloutSubview
                        style={styles.addressButton}
                        onPress={() => {
                          setAddress(false);
                          getAddress(lat, lng);
                        }}
                      >
                        <Text style={{ paddingTop: 5, color: 'white' }}>
                          {ucFirst({ id: 'general.getAddress' })}
                        </Text>
                      </CalloutSubview>
                    </View>
                  </Card.Actions>
                )}
                {!address && (
                  <Card.Actions>
                    <View
                      style={{
                        alignSelf: 'center',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <CalloutSubview>
                        <Text style={{ paddingTop: 5, color: 'black' }}>
                          Address: {currentAddress}
                        </Text>
                      </CalloutSubview>
                    </View>
                  </Card.Actions>
                )}
              </View>
            )}
          </Paragraph>
        </Card.Content>
      </Card>
    </Callout>
  );
};

export default MarkerInfo;
