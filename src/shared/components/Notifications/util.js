import _ from 'lodash';

export const getNotificationsList = ({ current }) =>
  _.map(current, (channels, notificationType) =>
    _.map(channels, (items, channel) => items.map(item => ({ ...item, notificationType, channel })))
  ).flat(2);
