import { LOAD_DEVICE_LIST, EMPTY_DEVICE_LIST } from 'constants/ActionTypes';
import { getDeviceStatus } from 'api/MiddlewareAPI';

export const loadDeviceList = () => async dispatch => {
  const list = await getDeviceStatus();
  const deviceDataList = list?.map(device => {
    const { assisteeData, companyName, id, ...rest } = device;
    let { firstName, lastName } = assisteeData;
    let defaultState = false;
    rest.status.forEach(({ type }) => {
      defaultState = defaultState || type === 'defaultState';
    });
    if (!firstName && !lastName) {
      firstName = 'not';
      lastName = 'connected';
    }
    return { ...rest, firstName, lastName, deviceId: id, name: companyName, defaultState };
  });
  dispatch({
    type: LOAD_DEVICE_LIST,
    deviceDataList,
  });
};

export const emptyDeviceList = deviceData => ({
  type: EMPTY_DEVICE_LIST,
  deviceData,
});
