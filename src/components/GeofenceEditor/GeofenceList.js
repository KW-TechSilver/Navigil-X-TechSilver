import React, { useContext } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import useFormatMessage from 'hooks/useFormatMessage';

import Context from './context';
import { geofenceViewport } from './utils';

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});

const GeofenceList = () => {
  const { ucFirst } = useFormatMessage();
  const { geofences, setId, setShowList, setCenter } = useContext(Context);

  const onPress = geofence => {
    if (geofence.coordinates?.length) {
      setCenter(geofenceViewport(geofence));
    }

    setId(geofence.id);
    setShowList(false);
  };

  return (
    <ScrollView>
      {geofences.map(geofence => {
        const { id, geofenceAreaName, type, radius } = geofence;

        return (
          <TouchableOpacity key={id} onPress={() => onPress(geofence)}>
            <View style={styles.item}>
              <View style={{ width: '100%' }}>
                <Text>{geofenceAreaName}</Text>
              </View>

              <View style={styles.itemDetails}>
                <View style={{ width: '50%' }}>
                  <Text>{ucFirst({ id: `general.${type}` })}</Text>
                </View>

                <View style={{ width: '50%' }}>
                  {type === 'circle' && (
                    <Text>
                      {ucFirst({ id: 'geofenceEditor.radius' })} {radius} m
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default GeofenceList;
