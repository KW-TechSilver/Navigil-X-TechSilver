import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'i18n/date-fns';

const CurrentRange = ({ filter }) => {
  const endDate = format(filter.endDate, 'MM/dd');
  const startDate = format(filter.endDate - filter.length, 'MM/dd');
  return (
    <View style={{ marginLeft: 'auto', marginRight: 30 }}>
      <Text>
        {startDate} - {endDate}
      </Text>
    </View>
  );
};

export default CurrentRange;
