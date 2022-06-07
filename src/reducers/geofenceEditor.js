import { MOVE_REGION } from 'constants/ActionTypes';
import { DEFAULT_REGION } from 'components/GeofenceEditor/constants';

const DEFAULT_STATE = { region: DEFAULT_REGION };

export default function geofenceEditor(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case MOVE_REGION: {
      return { ...state, region: action.region };
    }
    default: {
      return state;
    }
  }
}
