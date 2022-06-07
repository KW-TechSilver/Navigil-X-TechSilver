import React from 'react';
import PropTypes from 'prop-types';

const CollateReduxSideEffects = ({ datastores }) => {
  const datastoresWithKey = datastores.map((Store, index) => <Store key={index} />);
  return <>{datastoresWithKey}</>;
};

export default CollateReduxSideEffects;

CollateReduxSideEffects.propTypes = {
  datastores: PropTypes.arrayOf(PropTypes.elementType),
};
