import { SET_ADDRESS_MARKER } from 'constants/ActionTypes';

export default function addressMarker(state = null, action) {
  switch (action.type) {
    case SET_ADDRESS_MARKER: {
      return action.addressMarker;
    }
    default: {
      return state;
    }
  }
}
