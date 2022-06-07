import { SET_MAP_TYPE } from 'constants/ActionTypes';

export default function setMaptype(state = 'roadmap', action) {
  switch (action.type) {
    case SET_MAP_TYPE: {
      return action.mapType;
    }
    default: {
      return state;
    }
  }
}
