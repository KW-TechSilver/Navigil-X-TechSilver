import { useEffect, useRef } from 'react';

// setInterval-hook
// PARAMETERS
// REQUIRED
// callBack: callback to run on intervals (can be empty function, then does nothing)
// OPTIONAL
// interval: interval in <ms> (null/undefined runs function once/stops interval),
//  change affects next iterval, default <undefined>, OPTIONAL
// instant: shall the functin be ran isntantly or after first interval,
//  can't be changed later, default <true>, OPTIONAL
const useInterval = (callback, interval, instant = true) => {
  const savedCallback = useRef();
  const isRunning = useRef(false);
  const instantRef = useRef(instant);
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    let intervalId = null;
    function tick() {
      savedCallback.current();
    }
    if (interval !== null && interval !== undefined) {
      // Run immediately once
      if (!isRunning.current && instantRef.current) {
        tick();
      }
      isRunning.current = true;
      intervalId = setInterval(tick, interval);
    } else if (instantRef.current) {
      tick();
    }
    return () => {
      isRunning.current = false;
      clearInterval(intervalId);
    };
  }, [interval]);
  // return callback
  return savedCallback.current;
};

export default useInterval;
