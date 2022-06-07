import { SET_SERIAL_NUMBER } from 'constants/ActionTypes';

export const setSerialNumber = serialNumber => dispatch => {
  dispatch({
    type: SET_SERIAL_NUMBER,
    serialNumber: parseInt(serialNumber, 10),
  });
};
