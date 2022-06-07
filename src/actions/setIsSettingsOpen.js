import { SET_IS_SETTINGS_OPEN, TOGGLE_SETTINGS_OPEN } from 'constants/ActionTypes';

export const setIsSettingsOpen = isSettingsOpen => ({
  type: SET_IS_SETTINGS_OPEN,
  isSettingsOpen,
});

export const closeSettings = () => ({
  type: SET_IS_SETTINGS_OPEN,
  isSettingsOpen: false,
});

export const openSettings = () => ({
  type: SET_IS_SETTINGS_OPEN,
  isSettingsOpen: true,
});

export const toggleSettings = () => ({
  type: TOGGLE_SETTINGS_OPEN,
  isSettingsOpen: null,
});
