import { useEffect, useCallback, useRef, useState } from 'react';

// Debouncing hook for values (not for functions, check useDebounceFunction for them)
// usage: const [value, setValueDebounced, isDebounced] = useDebounce(<defaultValue>, <timeout = 300>);
//
// Parameters: all optional,can be empty (check defaults)
//  Parameter1:
//    defaultValue = defaultValue for <value>, default <undefined>
//  Parameter2:
//    timeout = time for debouncing [ms], default 300 [ms]
//        or
//    object = {
//      timeout: time for debouncing <integer> [ms], default 300 [ms]
//      runFirst: if TRUE, state is changed immediately with first function call <boolean>, default FALSE
//      onlyLast: if TRUE, state is changed only after debounce time of last function call <boolean>, default FALSE
//    }
//
// return values:
//  value = <defaultValue> / value set by debounced <setValueDebounced(<newValue>)>
//  setValueDebounced = sets the value (debounced according to <timeout>)
//  isDebounced = boolean, is the setValue function beeing debounced

const TIMEOUT = 300;

const useParameterOverloading = params => {
  const _timeout = typeof params === 'number' ? params : params?.timeout ?? TIMEOUT;
  const _runFirst = params?.runFirst || false;
  const _onlyLast = params?.onlyLast || false;

  const timeoutRef = useRef(_timeout);
  const onlyLastRef = useRef(_onlyLast);
  const runFirstRef = useRef(_runFirst);

  useEffect(() => {
    runFirstRef.current = _runFirst;
    onlyLastRef.current = _onlyLast;
    timeoutRef.current = _timeout;
  }, [_timeout, _runFirst, _onlyLast]);

  return [timeoutRef, runFirstRef, onlyLastRef];
};

const useDebounceState = (defaultValue, parameters) => {
  const [timeoutRef, runFirstRef, onlyLastRef] = useParameterOverloading(parameters);
  const [value, setValue] = useState(defaultValue);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const isDebouncingRef = useRef(false);
  const timeoutIdRef = useRef(null);
  const valueRef = useRef(defaultValue);
  const runFirstCallbackRef = useRef(null);

  const debounceFunction = useCallback(
    params => {
      valueRef.current = params;
      if (runFirstRef.current) {
        if (!isDebouncingRef.current) {
          isDebouncingRef.current = true;
          setIsDebouncing(true);
          setValue(valueRef.current);
          timeoutIdRef.current = setTimeout(() => {
            setIsDebouncing(false);
          }, timeoutRef.current);
        } else if (onlyLastRef.current) {
          runFirstCallbackRef.current = () => setValue(valueRef.current);
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(() => {
            setIsDebouncing(false);
          }, timeoutRef.current);
        } else {
          runFirstCallbackRef.current = () => setValue(valueRef.current);
        }
      } else if (!isDebouncingRef.current) {
        isDebouncingRef.current = true;
        setIsDebouncing(true);
        timeoutIdRef.current = setTimeout(() => {
          setValue(valueRef.current);
          setIsDebouncing(false);
        }, timeoutRef.current);
      } else if (onlyLastRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(() => {
          setValue(valueRef.current);
          setIsDebouncing(false);
        }, timeoutRef.current);
      }
    },
    [onlyLastRef, runFirstRef, timeoutRef]
  );
  useEffect(
    () => () => {
      clearTimeout(timeoutIdRef.current);
    },
    []
  );
  useEffect(() => {
    isDebouncingRef.current = isDebouncing;
    if (!isDebouncing && runFirstCallbackRef.current) {
      runFirstCallbackRef.current();
      runFirstCallbackRef.current = null;
    }
  }, [isDebouncing]);
  return [value, debounceFunction, isDebouncing, setValue];
};

export default useDebounceState;
