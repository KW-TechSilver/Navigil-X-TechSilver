import { setIsFetchingCoordinates } from './setIsFetchingCoordinates';
import { setCoordinateFetchStatus } from './setCoordinateFetchStatus';

export const stopFetchingCoordinates = () => (dispatch, getStore) => {
  const { coordinateFetchStatus } = getStore();
  const intervalId = coordinateFetchStatus?.intervalId || null;
  clearInterval(intervalId);
  dispatch(setIsFetchingCoordinates(false));
  dispatch(setCoordinateFetchStatus(null));
};
