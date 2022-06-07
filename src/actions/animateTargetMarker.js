import { setMarkerAnimationAndCircle } from './setMarkerAnimationAndCircle';

const MARKER_BOUNCE_TIME = 1400; // ms

export const animateTargetMarker = index => dispatch => {
  const bounceTimer = setTimeout(() => {
    dispatch(setMarkerAnimationAndCircle({ animateMarker: null }));
  }, MARKER_BOUNCE_TIME);
  dispatch(
    setMarkerAnimationAndCircle({
      animateMarker: index,
      bounceTimer,
      showCircleIndex: index,
    })
  );
};
