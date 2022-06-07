import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useFormatMessage from 'hooks/useFormatMessage';
import { format as formatWithLocale } from 'i18n/date-fns';
import Warning from 'assets/svg/warning.svg';
import { NOTIFICATIONS_INFO } from './variablesAndConstants';

export const useNotifications = ({ defaultValue }) => {
  const { ucFirst } = useFormatMessage();
  const [notificationBadges, setNotificationsBadges] = useState(defaultValue);
  const { activeStatus } = useSelector(state => ({ activeStatus: state.activeStatus }));
  const data = activeStatus ?? defaultValue;

  useEffect(() => {
    let _notificationBadges = data && !data.error ? { ...data } : defaultValue;
    if (data && data.alarms) {
      const { alarms: _alarms, warnings: _warnings, info: _info } = data;

      const createBadges = (items = [], badgeType = '') =>
        items.map(({ extra, type, dismissable, timestampUTC, value, units }) => ({
          id: type,
          dismissable,
          priority: NOTIFICATIONS_INFO?.[type]?.priority || 1000,
          badgeProps: {
            extra,
            name: ucFirst({ id: `${badgeType}Message.${type}` }),
            status: badgeType,
            type,
            textLines: [
              formatWithLocale(new Date(timestampUTC), 'P'),
              formatWithLocale(new Date(timestampUTC), 'p'),
            ],
            mainValue: value,
            mainUnit: units,
          },
          imageComponent: NOTIFICATIONS_INFO?.[type]?.icon || Warning,
          imageProps: {
            fill: 'white',
            status: value,
          },
        }));

      const alarmBadges = createBadges(_alarms, 'alert').sort((a, b) => a - b);
      const warningBadges = createBadges(_warnings, 'warning').sort((a, b) => a - b);
      const infoBadges = createBadges(_info, 'info').sort((a, b) => a - b);

      _notificationBadges = {
        ...data,
        alarms: alarmBadges,
        warnings: warningBadges,
        info: infoBadges,
      };
    }

    setNotificationsBadges(_notificationBadges);
  }, [data, defaultValue, ucFirst]);

  return [notificationBadges];
};
