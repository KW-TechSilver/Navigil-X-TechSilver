const TIME_DIVIDER = {
  s: 1000,
  ms: 1,
};

export const getSignalLevelColor = networkSignalLevel =>
  !networkSignalLevel || networkSignalLevel > 139
    ? 'unknown'
    : networkSignalLevel > 120
    ? 'red'
    : networkSignalLevel > 104
    ? 'yellow'
    : 'green';

export const getTimeAdjustment = (coordinate, unit = 's') => {
  let timeAdjust = 0;
  if (coordinate) {
    const localOffsetFromUTC = new Date().getTimezoneOffset() * 60 * 1000;
    const { date1, date2 } = coordinate.locationData;
    timeAdjust =
      (new Date(date2).getTime() - (new Date(date1).getTime() - localOffsetFromUTC)) /
      TIME_DIVIDER[unit];
  }
  return timeAdjust;
};

export const handleCoordinatesFetchData = ({ coordsData }) => {
  const coords = {
    target: [],
    helpers: [],
  };
  const { helpers, target } = coords;
  const timeAdjustment = getTimeAdjustment(coordsData?.[0] || null);
  coordsData.forEach(fetchedCoord => {
    const { locationData } = fetchedCoord;
    const _locationData = { ...locationData };
    _locationData.date += timeAdjustment;
    const coordinate = { ...fetchedCoord, locationData: _locationData };
    const { cognitoSub } = coordinate;
    if (cognitoSub) {
      helpers.push(coordinate);
    } else {
      target.push(coordinate);
    }
  });
  return coords;
};

export const getGeofencesFromBackend = async ({ serialNumber, getGeofences }) => {
  const geofences = {};
  try {
    const geofencesData = await getGeofences({ serialNumber });
    geofencesData.body.forEach(geofence => {
      geofences[geofence.id] = { ...geofence };
    });
  } catch (error) {
    console.log(error);
    return null;
  }
  return geofences;
};

export const adjustCoordinateTime = coordinate => {
  const timeAdjustment = getTimeAdjustment(coordinate);
  return coordinate.locationData.date + timeAdjustment;
};

export const deAdjustCoordinateTime = coordinate => {
  const timeAdjustment = getTimeAdjustment(coordinate);
  return coordinate.locationData.date - timeAdjustment;
};
