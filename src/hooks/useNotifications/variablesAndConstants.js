/* eslint-disable no-tabs */
/* eslint-disable import/no-unresolved */

import Activity from 'assets/svg/activity.svg';
import AlarmCall from 'assets/svg/alarmCall.svg';
import AlarmCallEnded from 'assets/svg/alarmCallEnded.svg';
import Battery from 'assets/svg/battery.svg';
import BatteryEmpty from 'assets/svg/batteryEmpty.svg';
import BatteryLow from 'assets/svg/batteryLow.svg';
import BodyTemperature from 'assets/svg/bodyTemperature.svg';
import Call from 'assets/svg/call.svg';
import CellLocation from 'assets/svg/cellLocation.svg';
import ChargerDisconnected from 'assets/svg/chargerDisconnected.svg';
import ChargingInterrupted from 'assets/svg/chargingInterrupted.svg';
import Checked from 'assets/svg/checked.svg';
import CircadianCycle from 'assets/svg/circadianCycle.svg';
import ExtPow from 'assets/svg/externalPowerConnected.svg';
import FactoryState from 'assets/svg/factoryState.svg';
import GeofenceAlarm from 'assets/svg/geofenceAlarm.svg';
import HeartRate from 'assets/svg/heartRateRest.svg';
import HeartRateVariability from 'assets/svg/heartRateVariability.svg';
import HomeBeacon from 'assets/svg/homeBeacon.svg';
import HomeBeaconRangeExit from 'assets/svg/homeBeaconRangeExit.svg';
import LocationMarker from 'assets/svg/locationMarker.svg';
import LocationNotAvailableMarker from 'assets/svg/locationNotAvailableMarker.svg';
import ManDown from 'assets/svg/manDown.svg';
import Network from 'assets/svg/network.svg';
import NoMovement from 'assets/svg/noMovement.svg';
import NoNetwork from 'assets/svg/noNetwork.svg';
import ProhibitedAreaEnter from 'assets/svg/prohibitedAreaEnter.svg';
import ProhibitedAreaExit from 'assets/svg/prohibitedAreaExit.svg';
import RespiratoryRate from 'assets/svg/respiratoryRate.svg';
import Warning from 'assets/svg/warning.svg';
import SosRecording from 'assets/svg/sosRecording.svg';
import EmergencyTracking from 'assets/svg/emergencyTrackingOn.svg';

export const NOTIFICATIONS_INFO = {
  noConnection: { icon: NoNetwork, name: 'No connection', priority: 0 },
  sosCall: { icon: AlarmCallEnded, name: 'Alarm call', priority: 1 },
  sosCallInitiated: {
    icon: AlarmCall,
    name: 'Alarm call initiated',
    priority: 2,
  },
  sosVoiceRecording: {
    icon: SosRecording,
    name: 'Recorded SOS Message',
    priority: 2,
  },
  call: { icon: Call, name: 'call', priority: 3 },
  geofenceOut: { icon: GeofenceAlarm, name: 'Safetyfence out', priority: 4 },
  homebeaconOut: {
    icon: HomeBeaconRangeExit,
    name: 'Homebeacon exit',
    priority: 5,
  },
  beaconAreaAlarm: {
    icon: ProhibitedAreaEnter,
    name: 'Enter prohibited area',
    priority: 6,
  },
  manDown: { icon: ManDown, name: 'Man down', priority: 7 },
  noMovement: { icon: NoMovement, name: 'No movement', priority: 8 },
  battEmpty: { icon: BatteryEmpty, name: 'Battery empty', priority: 9 },
  battLow: { icon: Battery, name: 'Battery low', priority: 10 },
  battChargingErr: {
    icon: ChargerDisconnected,
    name: 'Charging error',
    priority: 11,
  },
  battChargingInterrupted: {
    icon: ChargingInterrupted,
    name: 'Charging interrupted',
    priority: 12,
  },
  networkConn: { icon: Network, name: 'Connection warning', priority: 13 },
  homeBeaconPwr: {
    icon: HomeBeacon,
    name: 'Homebeacon power error',
    priority: 14,
  },
  agps: { icon: Warning, name: 'AGPS', priority: 15 },
  watchHandCalib: { icon: Warning, name: 'Calibration error', priority: 16 },
  extPwr: { icon: ExtPow, name: 'External power connected', priority: 17 },
  battFull: { icon: Battery, name: 'battery full', priority: 18 },
  emergTrackingActive: {
    icon: EmergencyTracking,
    name: 'emergency tracking active',
    priority: 19,
  },
  heartRate: { icon: HeartRate, name: 'Heartrate', priority: 20 },
  defaultState: { icon: FactoryState, name: 'Factory state', priority: 21 },
  generic: { icon: Warning, name: 'Generic error', priority: 21 },
};

// {
//   alarms: [{
//     type: 'noConnection',
//     value: '',
//     units: '',
//     timestamp: ,
//     dismissable: false
//   }],
//     warnings: [],
//       info: []
// }

// alarms:
// - no connection(noConnection)
// - SOS call no answer(sosCall)
// - battery empty(battEmpty)
// - home beacon out(homebeaconOut)
// - forbidden area enter(forbiddenAreaEnter)
// - man down(manDown)
// - no movement(noMovement)
// - geofence out(geofenceOut)

// warnings:
// - battery low(battLow)
// - battery charging error(battChargingErr)
// - battery charging interrupted(battChargingInterrupted)
// - connection warning(networkConn)
// - home beacon power warning(homeBeaconPwr)
// - Clock hands calibration warning(watchHandCalib)

// status:
// - External power connected(extPwr)
// - battery full(battFull)
// - emergency tracking active(emergTrackingActive)

export const ALERT_PRIORITIES = [
  {
    id: 'noConnection',
    name: 'No connection',
    type: 'alert',
    icon: NoNetwork,
    value: '',
    unit: '',
    accountDismissable: false,
  },
  {
    id: 'sosCall',
    name: 'Alarm call',
    type: 'alert',
    icon: AlarmCall,
    value: '',
    unit: '',
    accountDismissable: true,
  },
  {
    id: 'geofenceOut',
    name: 'Safetyfence out',
    type: 'alert',
    icon: GeofenceAlarm,
    value: '',
    unit: '',
    accountDismissable: true,
  },
  {
    id: 'homebeaconOut',
    name: 'Homebeacon exit',
    type: 'alert',
    icon: HomeBeaconRangeExit,
    value: '',
    unit: '',
    accountDismissable: true,
  },
  {
    id: 'forbiddenAreaEnter',
    name: 'Forbidden area enter',
    type: 'alert',
    icon: ProhibitedAreaEnter,
    value: '',
    unit: '',
    accountDismissable: true,
  },
  {
    id: 'manDown',
    name: 'Man down',
    type: 'alert',
    icon: ManDown,
    value: '',
    unit: '',
    accountDismissable: true,
  },
  {
    id: 'noMovement',
    name: 'No movement',
    type: 'alert',
    icon: NoMovement,
    value: '',
    unit: '',
    accountDismissable: true,
  },
  {
    id: 'battEmpty',
    name: 'Battery empty',
    type: 'alert',
    icon: BatteryEmpty,
    value: 8,
    unit: '%',
    accountDismissable: false,
  },
  {
    id: 'battLow',
    name: 'Battery low',
    type: 'warning',
    icon: BatteryLow,
    value: 20,
    unit: '%',
    accountDismissable: false,
  },
  {
    id: 'battChargingErr',
    name: 'Charging error',
    type: 'warning',
    icon: ChargerDisconnected,
    value: '',
    unit: '',
    accountDismissable: false,
  },
  {
    id: 'battChargingInterrupted',
    name: 'Charging interrupted',
    type: 'warning',
    icon: ChargingInterrupted,
    value: '',
    unit: '',
    accountDismissable: true,
  },
  {
    id: 'networkConn',
    name: 'Connection warning',
    type: 'warning',
    icon: Network,
    value: '',
    unit: '',
    accountDismissable: false,
  },
  {
    id: 'homeBeaconPwr',
    name: 'Homebeacon power error',
    type: 'warning',
    icon: HomeBeacon,
    value: '',
    unit: '',
    accountDismissable: false,
  },
  {
    id: 'agps',
    name: 'AGPS',
    type: 'warning',
    icon: Warning,
    value: '',
    unit: '',
    accountDismissable: false,
  },
  {
    id: 'watchHandCalib',
    name: 'Calibration error',
    type: 'warning',
    icon: Warning,
    value: '',
    unit: '',
    accountDismissable: false,
  },
  {
    id: 'defaultState',
    name: 'Factory settings',
    type: 'info',
    icon: FactoryState,
    value: '',
    unit: '',
    accountDismissable: false,
  },
  {
    id: 'generic',
    name: 'Generic error',
    type: 'warning',
    icon: Warning,
    value: '',
    unit: '',
    accountDismissable: true,
  },
];
export const statusBadges = [
  {
    id: 'extPwr',
    name: 'External power connected',
    type: '',
    icon: ChargerDisconnected,
    value: '',
    unit: '',
    accountDismissable: false,
  },
  {
    id: 'emergTrackingActive',
    name: 'Emergency Tracking',
    type: '',
    icon: Warning,
    value: '',
    unit: '',
    accountDismissable: true,
  },
  {
    id: 'battFull',
    name: 'Battery full',
    type: 'warning',
    icon: Warning,
    value: '',
    unit: '',
    accountDismissable: false,
  },
];
// 1.Ei yhteyttä(punainen väri)
// 2.	SOS puhelu ei vastatusta(punainen väri)
// 3.	Turva - alueelta poistuminen(punainen väri)
// 4.	Kotimajakan alueelta poistuminen(punainen väri)
// 5.	Kielletyn majakan alueelle saapuminen(punainen väri)
// 6.	Käyttäjä kaatunut(punainen väri)
// 7.	Ei liikettä(punainen väri)
// 8.	Akku tyhjä(punainen väri)
// 9.	Akkujännite vähissä(keltainen väri)
// 10.	Akun latausvirhe(keltainen väri)
// 11.	Akun lataus keskeytetty(keltainen väri)
// 12.	Verkkoyhteyshäiriö(keltainen väri)
// 13.	Kotimajakan virtakatkovaroitus(keltainen väri)
// 14.	AGPS tiedosto puuttuu(keltainen väri)
// 15.	Kellon kalibrointivirhe(keltainen väri)
// 16.	Geneerinen virhe(keltainen väri)

const batteryStatus = [280, 50, 15, 5];

export const chartBadges = [
  {
    badgeProps: {
      name: 'Battery status',
      status: '',
      mainValue: batteryStatus[0],
      mainUnit: '%',
    },
    imageComponent: Battery,
    imageProps: {
      status: batteryStatus[0],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'HRV',
      status: 'warning',
      mainValue: batteryStatus[1],
      mainUnit: '',
    },
    imageComponent: HeartRate,
    imageProps: {
      status: batteryStatus[1],
      fill: 'white',
    },
  },
];

export const badges = [
  {
    badgeProps: {
      name: 'Battery',
      status: 'warning',
      mainValue: batteryStatus[0],
      mainUnit: '%',
    },
    imageComponent: Battery,
    imageProps: {
      status: batteryStatus[0],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'Activity',
      status: '',
      mainValue: batteryStatus[1],
      mainUnit: '%',
    },
    imageComponent: Activity,
    imageProps: {
      status: batteryStatus[1],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'AlarmCall',
      status: 'warning',
      mainValue: batteryStatus[2],
      mainUnit: '%',
    },
    imageComponent: AlarmCall,
    imageProps: {
      status: batteryStatus[2],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'BodyTemperature',
      status: 'alert',
      mainValue: batteryStatus[3],
      mainUnit: '%',
    },
    imageComponent: BodyTemperature,
    imageProps: {
      status: batteryStatus[3],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'Call',
      status: '',
      mainValue: batteryStatus[0],
      mainUnit: '%',
    },
    imageComponent: Call,
    imageProps: {
      status: batteryStatus[0],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'CellLocation',
      status: '',
      mainValue: batteryStatus[1],
      mainUnit: '%',
    },
    imageComponent: CellLocation,
    imageProps: {
      status: batteryStatus[1],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'ChargerDisconnected',
      status: 'warning',
      mainValue: batteryStatus[2],
      mainUnit: '%',
    },
    imageComponent: ChargerDisconnected,
    imageProps: {
      status: batteryStatus[2],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'ChargingInterrupted',
      status: 'alert',
      mainValue: batteryStatus[3],
      mainUnit: '%',
    },
    imageComponent: ChargingInterrupted,
    imageProps: {
      status: batteryStatus[3],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'Checked',
      status: '',
      mainValue: batteryStatus[0],
      mainUnit: '%',
    },
    imageComponent: Checked,
    imageProps: {
      status: batteryStatus[0],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'CircadianCycle',
      status: '',
      mainValue: batteryStatus[1],
      mainUnit: '%',
    },
    imageComponent: CircadianCycle,
    imageProps: {
      status: batteryStatus[1],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'GeofenceAlarm',
      status: 'warning',
      mainValue: batteryStatus[2],
      mainUnit: '%',
    },
    imageComponent: GeofenceAlarm,
    imageProps: {
      status: batteryStatus[2],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'HeartRateVariability',
      status: 'alert',
      mainValue: batteryStatus[3],
      mainUnit: '%',
    },
    imageComponent: HeartRateVariability,
    imageProps: {
      status: batteryStatus[3],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'HomeBeacon',
      status: '',
      mainValue: batteryStatus[0],
      mainUnit: '%',
    },
    imageComponent: HomeBeacon,
    imageProps: {
      status: batteryStatus[0],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'HomeBeaconRangeExit',
      status: '',
      mainValue: batteryStatus[1],
      mainUnit: '%',
    },
    imageComponent: HomeBeaconRangeExit,
    imageProps: {
      status: batteryStatus[1],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'LocationMarker',
      status: 'warning',
      mainValue: batteryStatus[2],
      mainUnit: '%',
    },
    imageComponent: LocationMarker,
    imageProps: {
      status: batteryStatus[2],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'LocationNotAvailableMarker',
      status: 'alert',
      mainValue: batteryStatus[3],
      mainUnit: '%',
    },
    imageComponent: LocationNotAvailableMarker,
    imageProps: {
      status: batteryStatus[3],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'ManDown',
      status: '',
      mainValue: batteryStatus[0],
      mainUnit: '%',
    },
    imageComponent: ManDown,
    imageProps: {
      status: batteryStatus[0],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'Network',
      status: '',
      mainValue: batteryStatus[1],
      mainUnit: '%',
    },
    imageComponent: Network,
    imageProps: {
      status: batteryStatus[1],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'NoMovement',
      status: 'warning',
      mainValue: batteryStatus[2],
      mainUnit: '%',
    },
    imageComponent: NoMovement,
    imageProps: {
      status: batteryStatus[2],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'NoNetwork',
      status: 'alert',
      mainValue: batteryStatus[3],
      mainUnit: '%',
    },
    imageComponent: NoNetwork,
    imageProps: {
      status: batteryStatus[3],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'ProhibitedAreaEnter',
      status: '',
      mainValue: batteryStatus[0],
      mainUnit: '%',
    },
    imageComponent: ProhibitedAreaEnter,
    imageProps: {
      status: batteryStatus[0],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'ProhibitedAreaExit',
      status: '',
      mainValue: batteryStatus[1],
      mainUnit: '%',
    },
    imageComponent: ProhibitedAreaExit,
    imageProps: {
      status: batteryStatus[1],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'RespiratoryRate',
      status: 'warning',
      mainValue: batteryStatus[2],
      mainUnit: '%',
    },
    imageComponent: RespiratoryRate,
    imageProps: {
      status: batteryStatus[2],
      fill: 'white',
    },
  },
  {
    badgeProps: {
      name: 'Warning',
      status: 'alert',
      mainValue: batteryStatus[3],
      mainUnit: '%',
    },
    imageComponent: Warning,
    imageProps: {
      status: batteryStatus[3],
      fill: 'white',
    },
  },
];
