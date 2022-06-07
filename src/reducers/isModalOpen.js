import { SET_IS_MODAL_OPEN } from 'constants/ActionTypes';

export default function setIsModalOpen(state = false, action) {
  switch (action.type) {
    case SET_IS_MODAL_OPEN: {
      return action.isModalOpen;
    }
    default: {
      return state;
    }
  }
}
