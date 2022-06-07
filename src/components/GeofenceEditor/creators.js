const BASIC_GEOFENCE = {
  radius: 500,
  schedule: [
    {
      scheduleName: 'default',
      start: '00:00',
      end: '00:00',
      weekdays: {
        fri: 1,
        mon: 1,
        sat: 1,
        sun: 1,
        thu: 1,
        tue: 1,
        wed: 1,
      },
    },
  ],
  settings: {
    mbia: 0,
    mboa: 0,
    hysteresis: 5,
    closedPath: 0,
    autoActivate: 1,
    geofenceGroupId: 99,
    geofenceActionId: 0,
  },
};

export const newPolygon = ({ id }) => ({
  ...BASIC_GEOFENCE,
  id,
  geofenceAreaName: `Geofence ${id}`,
  type: 'polygon',
});

export const newCircle = ({ id }) => ({
  ...BASIC_GEOFENCE,
  id,
  geofenceAreaName: `Geofence ${id}`,
  type: 'circle',
});
