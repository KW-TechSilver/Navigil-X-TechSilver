import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { localeStartOfWeekDay, weekdays as weekdaysFunction } from 'i18n/date-fns';

const weekdaysBackendArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const weekdaysBackendLocalized = () => {
  const weekdays = [...weekdaysBackendArray];
  const startOfWeekDay = localeStartOfWeekDay();
  if (startOfWeekDay) {
    const endOfWeekdays = weekdays.splice(0, startOfWeekDay);
    endOfWeekdays.forEach(day => {
      weekdays.push(day);
    });
  }
  return weekdays;
};

const createDayIndexes = weekdays => {
  const indexes = {};
  weekdays.forEach((day, index) => {
    indexes[day] = index;
  });
  return indexes;
};

const useWeekdays = (type = 'short') => {
  const { locale } = useIntl();

  const [weekdaysBackend, setWeekdaysBackend] = useState(weekdaysBackendLocalized());
  const [dayIndexesBE, setDayIndexesBE] = useState(createDayIndexes(weekdaysBackend));
  const [weekdays, setWeekdays] = useState(weekdaysFunction(type));
  const [dayIndexes, setDayIndexes] = useState(createDayIndexes(weekdays));

  useEffect(() => {
    setDayIndexesBE(createDayIndexes(weekdaysBackend));
  }, [weekdaysBackend]);
  useEffect(() => {
    setDayIndexes(createDayIndexes(weekdays));
  }, [weekdays]);
  useEffect(() => {
    setWeekdays(weekdaysFunction(type));
  }, [locale, type]);
  useEffect(() => {
    setWeekdaysBackend(weekdaysBackendLocalized());
  }, [locale]);

  return { dayIndexes, dayIndexesBE, weekdays, weekdaysBackend };
};

export default useWeekdays;
