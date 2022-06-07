import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFormatMessage from 'hooks/useFormatMessage';

const styles = StyleSheet.create({
  row: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsArea: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    marginTop: 0,
  },
});

const NOTIFICATIONS = ['showAllEnvironments'];

const SettingsView = () => {
  const { ucFirst } = useFormatMessage();
  const [isEnabled, setIsEnabled] = useState();
  useEffect(() => {
    if (isEnabled !== undefined) {
      AsyncStorage.setItem('allEnv', JSON.stringify(isEnabled));
    }
  }, [isEnabled]);
  const getData = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('allEnv');
      const parseValue = JSON.parse(value);
      console.log('parseValue', parseValue);
      if (parseValue !== null) {
        setIsEnabled(parseValue);
      }
    } catch (e) {
      // error reading value
    }
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  return (
    <ScrollView contentContainerStyle={{ minHeight: '100%' }} nestedScrollEnabled>
      <View style={{ marginBottom: 50 }}>
        <View style={styles.row}>
          <Text style={{ fontSize: 14, maxWidth: '90%' }}>
            {ucFirst({ id: 'general.settings' })}
          </Text>
        </View>
        <View style={styles.settingsArea}>
          {NOTIFICATIONS.map(notification => (
            <View style={styles.row} key={notification}>
              <Text style={{ fontSize: 16 }}>
                {ucFirst({ id: `notificationType.${notification}` })}
              </Text>
              <Switch onValueChange={toggleSwitch} value={isEnabled} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsView;
