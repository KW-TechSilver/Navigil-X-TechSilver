import { SET_IS_MODAL_OPEN } from 'constants/ActionTypes';

export const setIsModalOpen = isModalOpen => ({
  type: SET_IS_MODAL_OPEN,
  isModalOpen,
});
