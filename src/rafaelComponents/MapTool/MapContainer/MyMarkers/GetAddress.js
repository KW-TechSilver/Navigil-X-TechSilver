import React from 'react';
import useFormatMessage from 'hooks/useFormatMessage';
import { Button } from 'shared/styledTheme/index';

const GetAddress = ({ latLng, id, address, getAddress }) => {
  const { formatMessage } = useFormatMessage();
  return !address[id] ? (
    <Button color='primary' variant='contained' onClick={() => getAddress(latLng, id)}>
      {formatMessage({ id: 'general.getAddress' })}
    </Button>
  ) : (
    <div> Address: {address[id]}</div>
  );
};

export default GetAddress;
