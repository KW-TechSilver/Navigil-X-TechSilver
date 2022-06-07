import React, { forwardRef, Suspense, lazy, useRef, useState, useEffect } from 'react';
import Loading from 'shared/components/Loading/Loading';

// Lazyloads component from location 'src/lazy/index.js', or a given path (path must start with "rafaelComponents/")
// with default export file
// PARAMETERS:
// PARAM 1, REQUIRED: OBJECT = {
//  componentName:  <string>, name of the Component in 'src/lazy/index.js' or in location in 'path', REQUIRED
//  path: <string> path to component inside 'rafaelComponents', path must start with 'rafaelComponents' OPTIONAL
//  useSuspense: <boolean>, whether Component is wrapped with React.Suspense, OPTIONAL, defult TRUE
//  fallback: <react component>, fallback component for React.suspense, OPTIONAL
//            default "shared/components/Loading/Loading"
// RETURN VALUE: React component
//
// Examples:
//
// Component wrapped with <ReactSuspense />, using default fallback ('shared/components/Loading/Loading'):
//  component location: 'src/lazy/index.js':
//    const MyComponentWithSuspense = useLazyLoading({ componentName: 'MyComponent' })
//  component location: 'src/rafaelComponents/../MyComponent.js':
//    const MyComponentWithSuspense = useLazyLoading({
//       componentName: 'MyComponent',
//       path: 'rafaelComponents/<yourPath>/',
//    })
//
// Component without <ReactSuspense />, requires user to wrap it manually:
//  component location: 'src/lazy/index.js':
//    const MyComponentWithoutSuspense = useLazyLoading({ componentName: 'MyComponent', useSuspense: false })
//  component location: 'src/rafaelComponents/../MyComponent.js':
//    const MyComponentWithoutSuspense = useLazyLoading({
//       componentName: 'MyComponent',
//       path: 'rafaelComponents/<yourPath>/',
//       useSuspense: false,
//    })

export function withSuspense(NoSuspenseComponent, Fallback) {
  // eslint-disable-next-line react/display-name
  return forwardRef(({ children, ...props }, ref) => (
    <Suspense fallback={<Fallback />}>
      {NoSuspenseComponent ? (
        <NoSuspenseComponent ref={ref} {...props}>
          {children}
        </NoSuspenseComponent>
      ) : null}
    </Suspense>
  ));
}

const importComponent = (componentName, path) =>
  path
    ? lazy(() =>
        import(`../rafaelComponents/${path}${[componentName]}`).catch(() =>
          import('../dialogs/NotAvailable')
        )
      )
    : lazy(() =>
        import(`../lazy/index`)
          .then(module => {
            if (!module[componentName]) {
              const error = new Error(`No "${componentName}" exported in "lazy/index.js"`);
              throw error;
            }
            return { default: module[componentName] };
          })
          .catch(() => import('../dialogs/NotAvailable'))
      );

const handleImport = (componentName, path) => {
  const loadComponent = () => {
    let restOfPath = '';
    if (path) {
      restOfPath = `${path
        .split('/')
        .slice(1)
        .join('/')}`;
    }
    const lazyComponent = importComponent(componentName, restOfPath);
    return lazyComponent;
  };
  return loadComponent();
};

const useLazyLoading = ({ path, componentName, fallback = Loading, useSuspense = true }) => {
  alert("uselazyloading-hook is broken, please don't use it");

  const fallbackRef = useRef(fallback);
  const componentNameRef = useRef(componentName);
  const [component, setComponent] = useState(
    useSuspense ? handleImport(componentName, path) : null
  );
  const [noSuspenseComponent, setNoSuspenseComponent] = useState(
    useSuspense ? null : handleImport(componentName, path)
  );

  useEffect(() => {
    if (useSuspense && componentNameRef.current !== componentName) {
      setComponent(useSuspense ? handleImport(componentName, path) : null);
    }
    if (!useSuspense && componentNameRef.current !== componentName) {
      setNoSuspenseComponent(useSuspense ? null : handleImport(componentName, path));
    }
  }, [componentName, path, useSuspense]);

  useEffect(() => {
    componentNameRef.current = componentName;
  }, [componentName]);

  return useSuspense ? withSuspense(component, fallbackRef.current) : noSuspenseComponent;
};

export default useLazyLoading;
