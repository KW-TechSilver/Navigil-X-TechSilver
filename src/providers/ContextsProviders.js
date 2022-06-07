import React from 'react';
import PropTypes from 'prop-types';

const ContextsProviders = ({ children, wrappers, theme }) => {
  let wrappedComponent = children;
  const reverseWrappers = [...wrappers].reverse();
  reverseWrappers.forEach(Wrapper => {
    wrappedComponent = <Wrapper theme={theme}>{wrappedComponent}</Wrapper>;
  });
  return wrappedComponent;
};

ContextsProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  wrappers: PropTypes.arrayOf(PropTypes.func),
};

ContextsProviders.defaultProps = {
  wrappers: [],
};

export default ContextsProviders;
