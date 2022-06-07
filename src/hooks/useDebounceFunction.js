import { useRef } from 'react';

export default (func = () => {}, timeout = 500) => {
  const resolvesRef = useRef([]);
  const timeoutIdRef = useRef();
  const timeoutRef = useRef();
  const funcRef = useRef();
  funcRef.current = func;
  timeoutRef.current = timeout;

  const _resolveAll = (...args) => {
    const value = funcRef.current(...args);
    resolvesRef.current.forEach(resolve => resolve(value));
    resolvesRef.current = [];
  };

  const debouncedFunctionRef = useRef((...args) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => _resolveAll(...args), timeout);
    return new Promise(resolve => resolvesRef.current.push(resolve));
  });

  return debouncedFunctionRef.current;
};
