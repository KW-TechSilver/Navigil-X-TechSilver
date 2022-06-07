import HeartRate from 'assets/svg/heartRate.svg';
import HeartRateVariability from 'assets/svg/heartRateVariability.svg';
import Activity from 'assets/svg/activity.svg';
import Activity24h from 'assets/svg/activity24h.svg';
import RespiratoryRate from 'assets/svg/respiratoryRate.svg';
import SignalStrength from 'assets/svg/network.svg';
import Battery from 'assets/svg/battery.svg';
import HomeBeacon from 'assets/svg/homeBeacon.svg';

export const MAIN = 'general.charts';
export const ACTIVITY = 'general.activeVeryActive';
export const BATTERY = 'general.battery';
export const HEART_RATE = 'general.heartRate';
export const ACTIVITY_24H = 'general.activity';
export const RESPIRATORY_RATE = 'general.respiratoryRate';
export const BEACON = 'general.beacons';
export const SIGNAL_STRENGTH = 'general.signalStrength';
export const HRV = 'general.hrv';

export const SVG = {
  heartRate: HeartRate,
  battery: Battery,
  activity: Activity24h,
  activityBinned: Activity,
  hrv: HeartRateVariability,
  respiratoryRate: RespiratoryRate,
  signalStrength: SignalStrength,
  beacon: HomeBeacon,
};

export const WARNINGS = {
  heartRate: {
    low: 35,
    high: 100,
  },
  battery: 30,
  activity: 80,
  signalStrength: 104,
};

export const ALARMS = {
  heartRate: {
    low: 25,
    high: 180,
  },
  battery: 5,
  activity: 20,
  signalStrength: 120,
};
