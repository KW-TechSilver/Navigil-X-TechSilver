import _ from 'lodash';
import {
  SET_SPINNER,
  FETCH_ACTIVE_STATUS,
  FETCH_EMERGENCY_RECORDINGS,
  FETCH_COORDINATES,
  SET_USER_DATA,
} from 'constants/ActionTypes';

const getState = spinners => {
  const visible = !_.isEmpty(spinners);
  return { spinners, visible };
};

const showSpinner = ({ id, spinners }) => ({ ...spinners, [id]: id });
const hideSpinner = ({ id, spinners }) => _.omit(spinners, id);

const DEFAULT_STATE = { spinners: {}, visible: false };

export default function spinner(state = DEFAULT_STATE, action) {
  const { spinners } = state;

  switch (action.type) {
    case SET_SPINNER: {
      const { id, show } = action;
      const newSpinners = show ? showSpinner({ spinners, id }) : hideSpinner({ spinners, id });
      return getState(newSpinners);
    }

    case FETCH_ACTIVE_STATUS:
      return getState(hideSpinner({ spinners, id: 'activeStatus' }));

    case FETCH_EMERGENCY_RECORDINGS:
      return getState(hideSpinner({ spinners, id: 'emergencyRecordings' }));

    case SET_USER_DATA:
      return getState(hideSpinner({ spinners, id: 'userData' }));

    case FETCH_COORDINATES:
      return getState(hideSpinner({ spinners, id: 'fetchCoordinates' }));

    default: {
      return state;
    }
  }
}
