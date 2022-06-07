import { SET_ADDRESS_MARKER } from 'constants/ActionTypes';

export const setAddressMarker = addressMarker => ({
  type: SET_ADDRESS_MARKER,
  addressMarker,
});
