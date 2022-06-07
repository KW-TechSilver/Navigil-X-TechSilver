import { useEffect, useRef, useState } from 'react';
import useInterval from 'hooks/useInterval';
import { has, isEqual, last } from 'lodash';
import useSpinner from './useSpinner';

// creates a state value that controls when hook is been re-run, simiiar to
// useEffect dependency Array
const useDataResetter = (resets, controller) => {
  const [dataResetter, setDataResetter] = useState(resets);

  useEffect(() => {
    if (!controller.signal.aborted) {
      setDataResetter(current => {
        let _current = current;
        if (!isEqual(current, resets)) {
          _current = resets;
        }
        return _current;
      });
    }
  }, [controller, resets]);

  return dataResetter;
};

// handles overrriding hook props when using callback to manually update hook
const overrideProps = (propsRef, params) => {
  const lastParam = params.length > 0 ? last(params) : {};
  const overrideParams = {};
  let removeOverrides = false;
  Object.keys(propsRef.current).forEach(propName => {
    removeOverrides = removeOverrides || has(lastParam, propName);
    overrideParams[propName] = lastParam?.[propName] || propsRef.current[propName];
  });
  overrideParams.removeOverrides = removeOverrides;
  return overrideParams;
};

const useMiddlewareAPI = (
  {
    function: func = [() => {}],
    name,
    defaultValue = null,
    interval = null,
    autoFetch = true,
    abortController = null,
    onError = () => {},
    onStart = () => {},
    onSuccess = () => {},
    blockAutoFetch = false,
    spinner = false,
  },
  _dependencyArray = []
) => {
  const [mwFunction, ...mwFunctionParams] = func;

  const [data, setData] = useState(defaultValue);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const { hide: hideSpinner, show: showSpinner } = useSpinner();

  const propsRefs = useRef({
    autoFetch,
    blockAutoFetch,
    controller: abortController || new AbortController(),
    defaultValue,
    mwFunction,
    mwParams: mwFunctionParams,
    name,
    onFunctions: { onError, onStart, onSuccess },
    spinner,
  });

  const resetData = useRef(value => {
    setData(value || propsRefs.current.defaultValue);
    setError(null);
  });

  useEffect(() => () => propsRefs.current.controller.abort(), []);

  const dataResetter = useDataResetter(_dependencyArray, propsRefs.current.controller);

  useEffect(() => {
    propsRefs.current.blockAutoFetch = blockAutoFetch;
  }, [blockAutoFetch]);

  useEffect(() => {
    propsRefs.current.mwParams = mwFunctionParams;
  }, [mwFunctionParams]);

  useEffect(() => {
    propsRefs.current.mwFunction = mwFunction;
  }, [mwFunction]);

  useEffect(() => {
    propsRefs.current.name = name;
  }, [name]);

  useEffect(() => {
    propsRefs.current.onFunctions = { onError, onStart, onSuccess };
  }, [onError, onStart, onSuccess]);

  useEffect(() => {
    propsRefs.current.autoFetch = autoFetch;
  }, [autoFetch]);

  useEffect(() => {
    propsRefs.current.spinner = spinner;
  }, [spinner]);

  const fetchCallbackRef = useRef(async (...params) => {
    const {
      controller: refController,
      onFunctions: refOnFunctions,
      mwFunction: refMwFunction,
      mwParams: refMwParams,
      defaultValue: refDefaultValue,
      removeOverrides,
    } = overrideProps(propsRefs, params);

    const { signal } = refController;

    refOnFunctions.onStart();

    const overrideParams = [...params];
    if (removeOverrides) {
      overrideParams.splice(params.length - 1, 1);
    }

    setIsFetching(true);
    const spinnerId = propsRefs.current.spinner && showSpinner();

    try {
      let _data = await refMwFunction(
        ...(overrideParams.length > 0 ? overrideParams : refMwParams),
        signal
      );

      const { error } = _data || {};
      if (error) {
        refOnFunctions.onError();
        setError(_data.error);
        _data = _data.error;
      } else if (!signal.aborted) {
        refOnFunctions.onSuccess();
        setData(_data || refDefaultValue);
      }

      return _data;
    } finally {
      setIsFetching(false);

      if (propsRefs.current.spinner) {
        hideSpinner(spinnerId);
      }
    }
  });

  useEffect(() => {
    const {
      controller: {
        signal: { aborted },
      },
      blockAutoFetch: refBlockAutoFetch,
      defaultValue: refDefaultValue,
    } = propsRefs.current;

    if (!refBlockAutoFetch && !aborted) {
      setData(refDefaultValue);
      setError(null);
    }
  }, [dataResetter]);

  useInterval(
    propsRefs.current.blockAutoFetchRef ? () => {} : fetchCallbackRef.current,
    interval,
    false
  );

  useEffect(() => {
    const { blockAutoFetch: refBlockAutoFetch, autoFetch: refAutoFetch } = propsRefs.current;
    if (refAutoFetch && !refBlockAutoFetch) {
      fetchCallbackRef.current();
    }
  }, [dataResetter]);

  return [data, fetchCallbackRef.current, error, isFetching, resetData.current];
};

export default useMiddlewareAPI;
