import _ from 'lodash';
import { getDeviceCoordinatesData } from 'api/MiddlewareAPI';
import { FETCH_COORDINATES, SET_SPINNER } from 'constants/ActionTypes';
import { handleCoordinatesFetchData } from 'rafaelComponents/MapTool/Utils/Utils';
import { emergencyPositionTypes } from 'rafaelComponents/MapTool/MapContainer/MyMarkers/MyMarkerWithCircle/MarkerInfo';

const IS_CELL_LOCATION = {
  130: { 3: true, 4: true },
  201: {
    0: true,
  },
};

const {
  UNSPECIFIED,
  INITIAL,
  FIRST,
  FILTERED,
  FINAL,
  FAILED,
  EMERGENCY_TRACKING,
} = emergencyPositionTypes;

const filterCoordinates = x => {
  let finalReport;
  return x
    .filter((coordinate, index) => {
      let accept;
      const {
        emergencyPositionType,
        locationData: { date, messageId, positionType },
      } = coordinate;

      const isCellLocation = IS_CELL_LOCATION?.[messageId]?.[positionType];
      const lastMarker = index === x.length - 1;
      const allowLocation = !isCellLocation || lastMarker;
      if (!allowLocation) {
        return false;
      }

      if (emergencyPositionType === FINAL) {
        finalReport = date;
      }
      switch (emergencyPositionType) {
        case UNSPECIFIED:
        case INITIAL:
        case FAILED:
        case FIRST:
        case FILTERED:
        case EMERGENCY_TRACKING:
          accept = !(date > finalReport - 60);
          break;
        default:
          accept = true;
          break;
      }

      return accept;
    })
    .reverse();
};
const sortCoordinates = x => _.orderBy(x, ({ locationData }) => locationData.date, ['desc']);

export const fetchCoordinates = serialNumber => async (dispatch, getStore) => {
  const { filter: { endDate: _endDate, length, hoursDiff } = {} } = getStore();
  const endDate = new Date(_endDate).toISOString().replace('Z', '');
  const startDate = new Date(_endDate - length).toISOString().replace('Z', '');

  dispatch({ type: SET_SPINNER, id: 'fetchCoordinates', show: true });

  const coordsData = await getDeviceCoordinatesData({
    serialNumber,
    startDate,
    endDate,
    hoursDiff,
  });
  const { target, helpers } = handleCoordinatesFetchData({
    coordsData,
  });
  const coordinates = filterCoordinates(sortCoordinates(target));
  return dispatch({ type: FETCH_COORDINATES, coordinates, helpers });
};
