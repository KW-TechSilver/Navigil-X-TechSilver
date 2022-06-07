import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import useDeviceId from 'hooks/useDeviceId';
import { getDeviceSettings, saveDeviceSettings } from 'api/MiddlewareAPI';
import useFormatMessage from 'hooks/useFormatMessage';
import useSpinner from 'hooks/useSpinner';

import GeofenceEditor from './GeofenceEditor';

const Stack = createStackNavigator();

const GeofenceEditorWrapper = () => {
  const deviceId = useDeviceId();
  const { ucFirst } = useFormatMessage();
  const { withSpinner } = useSpinner();
  const [state, setState] = useState();
  const [initialized, setInitialized] = useState(false);
  const [geofences, setGeofences] = useState([]);

  const deviceIdRef = useRef(deviceId);
  deviceIdRef.current = deviceId;

  const _setGeofences = useCallback(
    data => {
      setGeofences(data);
      setState('dirty');
    },
    [setGeofences, setState]
  );

  const fetchSettings = useCallback(async () => {
    if (deviceId) {
      setState('progress');
      withSpinner(() =>
        getDeviceSettings({ deviceId }).then(settings => {
          if (deviceIdRef.current !== deviceId) {
            return;
          }
          setGeofences(settings?.geofences ?? []);
          setState('clean');
        })
      );
    }
  }, [deviceId, withSpinner]);

  const saveSettings = useCallback(async () => {
    if (deviceId) {
      setState('progress');
      await withSpinner(() => saveDeviceSettings({ deviceId, settings: { geofences } }));
      setState('clean');
    }
  }, [deviceId, withSpinner, geofences]);

  const getSaveButton = useCallback(
    () =>
      state === 'dirty' ? (
        <View style={{ marginRight: 5 }}>
          <Button onPress={saveSettings} title={ucFirst({ id: 'general.save' })} />
        </View>
      ) : null,
    [state, saveSettings, ucFirst]
  );

  useEffect(() => {
    setInitialized(false);
    fetchSettings();
  }, [deviceId, fetchSettings]);

  useEffect(() => {
    if (state === 'clean') {
      setInitialized(true);
    }
  }, [state]);

  return (
    <Stack.Navigator initialRouteName='SettingsMain'>
      <Stack.Screen
        name='SettingsMain'
        options={{
          title: ucFirst({ id: 'deviceSettings.safetyfenceEditor' }),
          headerRight: getSaveButton,
        }}
      >
        {() => (
          <GeofenceEditor
            geofences={geofences}
            setGeofences={_setGeofences}
            state={state}
            initialized={initialized}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default GeofenceEditorWrapper;
