import { ALARMS, WARNINGS } from './constants';

export const getStatus = ({ mainValue }, type) => {
  const number = parseInt(mainValue, 10);
  let _status = null;
  switch (type) {
    case 'activity':
    case 'battery':
      _status = number < ALARMS[type] ? 'alarm' : number < WARNINGS[type] ? 'warning' : '';
      break;
    case 'signalStrength':
      _status = number > ALARMS[type] ? 'alarm' : number > WARNINGS[type] ? 'warning' : '';
      break;
    case 'heartRate':
      _status =
        number < ALARMS[type].low || number > ALARMS[type].high
          ? 'alarm'
          : number < WARNINGS[type].low || number > WARNINGS[type].high
          ? 'warning'
          : 'noAlarm';
      break;
    default:
      _status = '';
      break;
  }
  return _status;
};
