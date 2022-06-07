import { SET_IS_FULLSCREEN } from 'constants/ActionTypes';

export const setIsFullscreen = isFullscreen => ({
  type: SET_IS_FULLSCREEN,
  isFullscreen,
});

// export const toggleFullscreen = fullscreenElement => {
//   const isFullscreen = callToggleFullscreen(fullscreenElement);
//   return {
//     type: SET_IS_FULLSCREEN,
//     isFullscreen,
//   };
// };
