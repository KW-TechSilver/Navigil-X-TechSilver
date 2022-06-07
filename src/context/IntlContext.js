import React from 'react';

const IntlContext = React.createContext({});

export function withIntlContext(Component) {
  return function contextedComponent(props) {
    return (
      <IntlContext.Consumer>
        {({ locales, setLocale }) => (
          <Component {...props} changeLocale={setLocale} locales={locales} />
        )}
      </IntlContext.Consumer>
    );
  };
}

export default IntlContext;
