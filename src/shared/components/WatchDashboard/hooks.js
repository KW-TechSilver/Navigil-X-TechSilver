import { useEffect, useMemo, useRef, useState } from 'react';
import { last, includes } from 'lodash';
import { getWatchData } from 'api/MiddlewareAPI';
import useMiddlewareAPI from 'hooks/useMiddlewareAPI';
import useDeviceId from 'hooks/useDeviceId';
import { differenceInDays, differenceInHours, getTime, startOfDay, startOfHour } from 'date-fns';
import { useIntl } from 'react-intl';
import { format as formatWithLocale } from 'i18n/date-fns';
import useFormatMessage from 'hooks/useFormatMessage';
import {
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

const INTERVAL = null;
export const SECOND_IN_MS = 1000;
export const HOUR_IN_MS = 60 * 60 * SECOND_IN_MS;
export const DAY_IN_MS = 24 * HOUR_IN_MS;

export const useAggregatedActivityData = ({ fetchedData, binBy, endDate }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // get the timeZone & change the timeZone from minutes to miliseconds
    const tz = new Date(endDate).getTimezoneOffset() * 60 * 1000;
    const aggregate = (_data, type) => {
      if (!_data) {
        return null;
      }
      const aggregatedData = [];
      let aggregatedElement = {
        date: new Date(_data[0]?.time * 1000 || 0),
        mode1: 0,
        mode2: 0,
      };
      let periodCounter = 0;
      const startOfFunction = date => {
        if (type === 'hour') {
          return startOfHour(date);
        }
        return startOfDay(date);
      };
      const differenceFunction = (date1, date2) => {
        if (type === 'hour') {
          return differenceInHours(date1, date2) - 1;
        }
        return differenceInDays(date1, date2) - 1;
      };
      _data.forEach((element, index, array) => {
        // because time in data is correct while timeZone is added on date in binned Chart
        // so we need to add or minus the timeZone before showing it
        // time in miliseconds
        const elementDate = startOfFunction(new Date(element.time * 1000 + tz));
        const timeDifference = differenceFunction(elementDate, aggregatedElement.date);
        if (timeDifference >= 0) {
          aggregatedElement.mode1 = parseInt(
            (aggregatedElement.mode1 / periodCounter).toFixed(0),
            10
          );
          aggregatedElement.mode2 = parseInt(
            (aggregatedElement.mode2 / periodCounter).toFixed(0),
            10
          );
          aggregatedData.push({
            ...aggregatedElement,
          });
          aggregatedElement = {
            date: elementDate,
            time: elementDate.getTime(),
            mode1: 0,
            mode2: 0,
          };
          periodCounter = 0;
        }
        aggregatedElement.date = elementDate;
        aggregatedElement.time = elementDate.getTime();
        aggregatedElement.mode1 += element.mode1;
        aggregatedElement.mode2 += element.mode2;
        periodCounter += 1;
        if (index === array.length - 1) {
          aggregatedElement.mode1 = parseInt(
            (aggregatedElement.mode1 / periodCounter).toFixed(0),
            10
          );
          aggregatedElement.mode2 = parseInt(
            (aggregatedElement.mode2 / periodCounter).toFixed(0),
            10
          );
          aggregatedData.push({
            ...aggregatedElement,
          });
        }
      });
      return aggregatedData;
    };
    if (fetchedData) {
      const _binnedData = aggregate(fetchedData.body, binBy);
      if (_binnedData) {
        setData(_binnedData);
      }
    }
  }, [fetchedData, binBy, endDate]);
  return data;
};

export const useActivityBinnedData = ({
  binBy = 'day',
  deviceId,
  startDate: sd,
  endDate: ed,
  abortSignal,
  snackbarReports,
  currentScreen,
  spinner,
}) => {
  const startDate = useMemo(() => formatWithLocale(new Date(sd), 'yyyy-MM-dd'), [sd]);
  const endDate = useMemo(() => formatWithLocale(new Date(ed), 'yyyy-MM-dd'), [ed]);
  const shouldFetch = includes([MAIN, ACTIVITY], currentScreen);
  const [fetchedData, fetchOnce] = useMiddlewareAPI(
    {
      function: [
        getWatchData,
        {
          deviceId,
          dataType: 'binData',
          startDate,
          endDate,
        },
      ],
      interval: INTERVAL,
      snackbarReports,
      blockAutoFetch: !startDate || !endDate || !shouldFetch,
      abortSignal,
      spinner,
    },
    [deviceId, sd, ed]
  );
  const binnedData = useAggregatedActivityData({ fetchedData, binBy, endDate });
  return [binnedData, fetchOnce];
};

export const useAggregatedBeaconData = ({ fetchedData, binBy, startDate }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const addObjectProperties = (obj1 = {}, obj2 = {}) => {
      const added = { ...obj1 };
      Object.keys(obj2).forEach(property => {
        added[property] = obj2[property] + (added?.[property] || 0);
      });
      return added;
    };
    const aggregate = _data => {
      if (!_data) {
        return null;
      }
      const aggregatedData = [];
      let aggregatedElement = {};
      let periodCounter = 0;
      _data.forEach((element, index, array) => {
        const elementDate = startOfDay(element.time);
        const timeDifference = differenceInDays(elementDate, aggregatedElement.date) || 0;
        if (timeDifference > 0) {
          const temp = [];
          Object.keys(aggregatedElement.areas).forEach(area => {
            temp.push(aggregatedElement.areas[area]);
            aggregatedElement.areas[area] /= periodCounter;
          });
          temp.push(periodCounter);
          temp.push(formatWithLocale(elementDate));
          aggregatedData.push({
            ...aggregatedElement,
          });
          aggregatedElement = {};
          periodCounter = 0;
        }
        aggregatedElement = {
          date: elementDate,
          time: elementDate.getTime(),
          areas: addObjectProperties(aggregatedElement.areas, element.areas),
        };
        periodCounter += 1;
        if (index === array.length - 1) {
          Object.keys(aggregatedElement.areas).forEach(area => {
            aggregatedElement.areas[area] /= periodCounter;
          });
          aggregatedData.push({
            ...aggregatedElement,
          });
        }
      });
      return aggregatedData;
    };
    const addMissingItems = _data => {
      const step = binBy === 'hour' ? HOUR_IN_MS : DAY_IN_MS;
      const newData = [];
      const areas = {};
      Object.keys(_data[0].areas).forEach(area => {
        areas[area] = 0;
      });
      let prevElement = {
        time: new Date(startDate).getTime(),
        date: startDate,
        areas,
      };
      _data.forEach(item => {
        const stepsMissing = Math.round((item.time - prevElement?.time) / step - 1) || 0;
        for (let index = 0; index < stepsMissing; index++) {
          const time = prevElement?.time + step;
          const date = new Date(time);
          const newElement = { time, date, areas: { ...prevElement.areas } };
          newData.push({ time, date, areas: { ...prevElement.areas } });
          prevElement = newElement;
        }
        newData.push(item);
        prevElement.time = item.time;
        prevElement.date = item.date;
      });
      return newData;
    };
    if (fetchedData && fetchedData?.areaData.length >= 0) {
      let _binnedAreaData = [];
      if (binBy === 'day') {
        _binnedAreaData = aggregate(fetchedData.areaData);
      } else {
        _binnedAreaData = [...fetchedData.areaData];
      }
      if (_binnedAreaData && _binnedAreaData.length > 0) {
        _binnedAreaData = addMissingItems(_binnedAreaData);
      }
      const _binnedData = { ...fetchedData, areaData: _binnedAreaData };

      if (_binnedData?.areaData?.length) {
        setData(_binnedData);
      }
    } else {
      setData(null);
    }
  }, [fetchedData, binBy, startDate]);
  return data;
};

export const useBeaconData = ({
  binBy = 'day',
  deviceId,
  startDate: sd,
  endDate: ed,
  snackbarReports,
  currentScreen,
  spinner,
}) => {
  const startDate = useMemo(() => formatWithLocale(new Date(sd), 'yyyy-MM-dd'), [sd]);
  const endDate = useMemo(() => formatWithLocale(new Date(ed), 'yyyy-MM-dd'), [ed]);
  const shouldFetch = includes([MAIN, BEACON], currentScreen);
  const [fetchedData, fetchOnce] = useMiddlewareAPI(
    {
      function: [
        getWatchData,
        {
          dataType: 'areaData',
          deviceId,
          startDate,
          endDate,
        },
      ],
      snackbarReports,
      blockAutoFetch: !startDate || !endDate || !shouldFetch,
      spinner,
    },
    [deviceId, sd, ed]
  );
  const [msData, setMsData] = useState(null);
  useEffect(() => {
    if (fetchedData && fetchedData.body.areaData.length >= 0) {
      const _intData = { ...fetchedData.body };
      const _areaData = _intData.areaData.map(point => {
        const dateString = point.date.replace('Z', '');
        const _date = new Date(dateString);
        return {
          ...point,
          date: new Date(dateString),
          time: _date.getTime(),
          // time: parseInt(point.time, 10) * 1000,
        };
      });
      _intData.areaData = _areaData;
      if (_intData.areaData.length > 0) {
        setMsData(_intData);
      } else {
        setMsData(null);
      }
    } else {
      setMsData(null);
    }
  }, [fetchedData]);
  const binnedData = useAggregatedBeaconData({
    fetchedData: msData,
    binBy,
    startDate: sd,
  });
  return [binnedData, fetchOnce];
};

const FETCH_UNITS = {
  heartrate: '',
  HRV: '',
  respiratoryRate: '',
};

export const useWellnessData = ({
  deviceId,
  startDate: sd,
  endDate: ed,
  charts = [],
  currentScreen,
  ...umwapiProps
}) => {
  const startDate = useMemo(() => formatWithLocale(new Date(sd), 'yyyy-MM-dd'), [sd]);
  const endDate = useMemo(() => formatWithLocale(new Date(ed), 'yyyy-MM-dd'), [ed]);
  const shouldFetch = includes([MAIN, HRV, HEART_RATE, RESPIRATORY_RATE], currentScreen);

  const [data, setData] = useState({});
  const [fetchedData, , , error, fetchOnce] = useMiddlewareAPI(
    {
      function: [
        getWatchData,
        {
          deviceId,
          startDate,
          endDate,
          dataType: 'vitalData',
        },
      ],
      interval: INTERVAL,
      blockAutoFetch: !startDate || !endDate || !shouldFetch,
      ...umwapiProps,
    },
    [deviceId, sd, ed]
  );
  useEffect(() => {
    if (fetchedData) {
      const { body } = fetchedData;
      const tempData = {};
      charts.forEach(typeName => {
        tempData[typeName] = null;
      });
      body
        .sort((a, b) => getTime(new Date(a.timestamp)) - getTime(new Date(b.timestamp)))
        .forEach(({ timestamp, ...rest }) => {
          charts.forEach(typeName => {
            if (rest[typeName]) {
              if (tempData[typeName] === null) {
                tempData[typeName] = [];
              }
              tempData[typeName].push({
                value: rest[typeName],
                date: new Date(timestamp * 1000),
                time: new Date(timestamp * 1000).getTime(),
                unit: FETCH_UNITS[typeName],
              });
            }
          });
        });
      setData(tempData);
    }
  }, [fetchedData, charts]);
  return [data, fetchOnce, error];
};

export const useBatteryData = ({
  deviceId,
  startDate: sd,
  endDate: ed,
  snackbarReports,
  abortSignal,
  spinner,
  currentScreen,
}) => {
  const startDate = useMemo(() => formatWithLocale(new Date(sd), 'yyyy-MM-dd'), [sd]);
  const endDate = useMemo(() => formatWithLocale(new Date(ed), 'yyyy-MM-dd'), [ed]);
  const shouldFetch = includes([MAIN, BATTERY], currentScreen);
  const [data, setData] = useState(null);
  const [fetchedData, fetchOnce] = useMiddlewareAPI(
    {
      function: [
        getWatchData,
        {
          deviceId,
          startDate,
          endDate,
          dataType: 'batteryData',
        },
      ],
      interval: INTERVAL,
      snackbarReports,
      blockAutoFetch: !startDate || !endDate || !shouldFetch,
      abortSignal,
      spinner,
    },
    [deviceId, sd, ed]
  );

  useEffect(() => {
    if (fetchedData) {
      const tempData = fetchedData.body
        .sort((a, b) => parseInt(a.watchTimestamp, 10) - parseInt(b.watchTimestamp, 10))
        .map(({ watchTimestamp, ...rest }) => ({
          value: rest.percentage,
          time: watchTimestamp * 1000,
          unit: '%',
        }));
      if (tempData.length > 0) {
        setData(tempData);
      } else {
        setData(null);
      }
    }
  }, [fetchedData]);
  return [data, fetchOnce];
};

export const useSignalStrengthData = ({
  deviceId,
  startDate: sd,
  endDate: ed,
  snackbarReports,
  abortSignal,
  currentScreen,
  spinner,
}) => {
  const startDate = useMemo(() => formatWithLocale(new Date(sd), 'yyyy-MM-dd'), [sd]);
  const endDate = useMemo(() => formatWithLocale(new Date(ed), 'yyyy-MM-dd'), [ed]);
  const shouldFetch = includes([MAIN, SIGNAL_STRENGTH], currentScreen);
  const [data, setData] = useState(null);
  const [fetchedData, fetchOnce] = useMiddlewareAPI(
    {
      function: [
        getWatchData,
        {
          deviceId,
          startDate,
          endDate,
          dataType: 'signalStrength',
        },
      ],
      interval: INTERVAL,
      snackbarReports,
      blockAutoFetch: !startDate || !endDate || !shouldFetch,
      abortSignal,
      spinner,
    },
    [deviceId, sd, ed]
  );

  useEffect(() => {
    if (fetchedData) {
      const tempData = fetchedData.body
        .sort((a, b) => parseInt(a.watchTimestamp, 10) - parseInt(b.watchTimestamp, 10))
        .map(({ watchTimestamp, ...rest }) => ({
          value: rest.networkSignalLevel,
          time: watchTimestamp * 1000,
          unit: 'dB',
        }));
      if (tempData.length > 0) {
        setData(tempData);
      } else {
        setData(null);
      }
    }
  }, [fetchedData]);
  return [data, fetchOnce];
};

export const useActivityPercentageData = ({
  deviceId,
  startDate: sd,
  endDate: ed,
  snackbarReports,
  abortSignal,
  currentScreen,
  spinner,
}) => {
  const startDate = useMemo(() => formatWithLocale(new Date(sd), 'yyyy-MM-dd'), [sd]);
  const endDate = useMemo(() => formatWithLocale(new Date(ed), 'yyyy-MM-dd'), [ed]);
  const shouldFetch = includes([MAIN, ACTIVITY_24H], currentScreen);
  const [data, setData] = useState(null);

  const [fetchedData, fetchOnce] = useMiddlewareAPI(
    {
      function: [
        getWatchData,
        {
          deviceId,
          startDate,
          endDate,
          dataType: 'activityData',
        },
      ],
      interval: INTERVAL,
      snackbarReports,
      blockAutoFetch: !startDate || !endDate || !shouldFetch,
      abortSignal,
      spinner,
    },
    [deviceId, sd, ed]
  );

  useEffect(() => {
    if (fetchedData && fetchedData.body.length > 0) {
      const tempData = fetchedData.body
        .sort((a, b) => getTime(new Date(a.timestamp)) - getTime(new Date(b.timestamp)))
        .map(({ percentage, date }) => ({
          value: percentage,
          // time: getTime(startOfDay(new Date(timestamp * 1000))),
          time: getTime(startOfDay(new Date(date))),
          unit: '%',
        }));
      setData(tempData);
    } else {
      setData(null);
    }
  }, [fetchedData]);
  return [data, fetchOnce];
};

export const useLastData = (data, binBy, noTime = false) => {
  const { ucFirst } = useFormatMessage();
  const { locale } = useIntl();
  const deviceId = useDeviceId();
  const [values, setValues] = useState({
    mainValue: '-',
    mainUnit: '',
    date: '-',
    time: '-',
  });

  const lastTime = useRef({});
  const valuesCache = useRef({});
  const deviceIdRef = useRef(deviceId);
  deviceIdRef.current = deviceId;

  useEffect(() => {
    const _deviceId = deviceIdRef.current;
    if ((data && data.length > 0) || lastTime.current[_deviceId]) {
      const lastItem = last(data);

      if (!lastItem || lastTime.current[_deviceId] >= lastItem.time) {
        setValues(valuesCache.current[_deviceId]);
        return;
      }
      lastTime.current[_deviceId] = lastItem.time;

      const { mode1, mode2, value, unit, time: timeValue } = lastItem;
      const binnedValue =
        typeof mode1 === 'number' ?? typeof mode2 === 'number' ? `${mode2}/${mode1}` : '-';
      const textLines = [];
      const showTime = !binBy || binBy === 'hour';
      textLines.push(timeValue ? formatWithLocale(timeValue, 'P') : '-');
      if (!noTime && showTime) {
        textLines.push(timeValue ? formatWithLocale(timeValue, 'p') : '-');
      }
      const mainValue = `${value ?? binnedValue}`;
      const mainUnit = `${unit ?? ''}`;
      setValues(
        (valuesCache.current[_deviceId] = {
          mainValue,
          mainUnit,
          textLines,
        })
      );
    } else {
      setValues({
        mainValue: '-',
        mainUnit: '',
        date: '-',
        time: '-',
      });
    }
  }, [binBy, data, locale, noTime, ucFirst]);
  return values;
};

// const ALL_WELLNESS_CHARTS = ['HRV', 'heartRate', 'respiratoryRate', 'temperature', 'activitylevel', ]
const WELLNESS_CHARTS = ['HRV', 'heartRate', 'respiratoryRate'];
export const useChartsData = ({ fetchRange, currentScreen }) => {
  const deviceId = useDeviceId();
  const [activityBinBy, setActivityBinBy] = useState('day');
  const [beaconBinBy, setBeaconBinBy] = useState('day');
  const [startDate, endDate] =
    fetchRange && fetchRange.map(x => new Date(x.toISOString()).toString());
  const [
    { HRV: hrvData, heartRate: heartRateData, respiratoryRate: respiratoryRateData },
    fetchWellnessData,
  ] = useWellnessData({
    startDate,
    endDate,
    deviceId,
    charts: WELLNESS_CHARTS,
    spinner: true,
    currentScreen,
  });
  const [activityPercentageData, fetchActivityData] = useActivityPercentageData({
    startDate,
    endDate,
    deviceId,
    spinner: true,
    currentScreen,
  });

  const [batteryData, fetchBatteryData] = useBatteryData({
    startDate,
    endDate,
    deviceId,
    spinner: true,
    currentScreen,
  });

  const [signalStrengthData, fetchSignalStrengthData] = useSignalStrengthData({
    startDate,
    endDate,
    deviceId,
    spinner: true,
    currentScreen,
  });

  const [activityBinnedData, fetchActivityBinnedData] = useActivityBinnedData({
    startDate,
    endDate,
    deviceId,
    binBy: activityBinBy,
    spinner: true,
    currentScreen,
  });

  const [beaconData, fetchBeaconAreaData] = useBeaconData({
    deviceId,
    binBy: beaconBinBy,
    startDate,
    endDate,
    spinner: true,
    currentScreen,
  });
  return {
    activityPercentageData,
    activityBinnedData,
    batteryData,
    signalStrengthData,
    heartRateData,
    hrvData,
    respiratoryRateData,
    fetchActivityBinnedData,
    fetchActivityData,
    fetchBatteryData,
    fetchBeaconAreaData,
    fetchSignalStrengthData,
    fetchWellnessData,
    fetchHeartRateData: fetchWellnessData,
    fetchHrvData: fetchWellnessData,
    fetchRespiratoryRateData: fetchWellnessData,
    activityBinBy,
    beaconBinBy,
    setActivityBinBy,
    setBeaconBinBy,
    beaconData,
  };
};
