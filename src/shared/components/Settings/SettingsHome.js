import _ from 'lodash';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useFormatMessage from 'hooks/useFormatMessage';
import useDeviceId from 'hooks/useDeviceId';
import useSpinner from 'hooks/useSpinner';
import useHelp from 'hooks/useHelp';
import {
  StyleSheet,
  Text,
  Switch,
  Button,
  TouchableOpacity,
  ScrollView,
  Platform,
  RefreshControl,
  View,
} from 'react-native';
import { actionColor } from 'core/theme';
import Slider from '@react-native-community/slider';
import SelectDevice from 'components/SelectDevice';
import { getDeviceSettings, saveDeviceSettings } from 'api/MiddlewareAPI';
import { AntDesign } from 'react-native-vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

const LOCATION_HELP = '/device-settings/location-settings';
const GENERAL_SETTINGS_HELP = '/device-settings/general-settings';

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

const DropdownSetting = ({ value, setValue, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      listMode={Platform.OS === 'android' ? 'MODAL' : 'SCROLLVIEW'}
      style={{
        backgroundColor: '#ffffff',
        color: '#000',
        borderWidth: 0,
        borderRadius: 0,
        margin: 0,
        padding: 0,
        height: 40,
      }}
      modalContentContainerStyle={{
        borderColor: '#fff',
        borderWidth: 0,
      }}
      modalProps={{
        title: 'lol',
      }}
      textStyle={{
        textAlign: 'right',
      }}
      listItemLabelStyle={{
        textAlign: 'left',
      }}
      listItemContainerStyle={{
        backgroundColor: '#fff',
        color: '#000',
        justifyContent: 'flex-start',
        height: 50,
      }}
      dropDownContainerStyle={{
        borderColor: '#ccc',
        backgroundColor: '#fafafa',
        borderRadius: 0,
        borderWidth: 1,
      }}
      value={value}
      setValue={setValue}
      items={items}
      open={open}
      setOpen={setOpen}
      dropDownDirection='BOTTOM'
    />
  );
};

const SettingsContext = React.createContext({});

const Settings = ({ setSettings, settings, setTouchedSettings }) => {
  const { ucFirst, formatMessage } = useFormatMessage();

  const changeSettings = useCallback(
    changeFn => {
      setSettings(changeFn);
      setTouchedSettings(changeFn);
    },
    [setTouchedSettings, setSettings]
  );

  const setSubsettings = useCallback(
    (keyName, subsettings) => {
      const { [keyName]: oldSubsettings } = settings;
      changeSettings(_settings => ({
        ..._settings,
        [keyName]: { ...oldSubsettings, ...subsettings },
      }));
    },
    [changeSettings, settings]
  );
  const setLocationAllowed = useCallback(
    locationAllowed => setSubsettings('devicePermissions', { locationAllowed }),
    [setSubsettings]
  );
  const setEmergencyLocationAllowed = useCallback(
    emergencyLocationAllowed => setSubsettings('devicePermissions', { emergencyLocationAllowed }),
    [setSubsettings]
  );
  const setDataRetentionDays = useCallback(
    dataRetentionDays => setSubsettings('devicePermissions', { dataRetentionDays }),
    [setSubsettings]
  );

  const setGeneralSettingsItem = useCallback(
    (keyName, value) => {
      if (_.includes(['trackingEnabled', 'volume', 'trackTraceFwdEnabled'], keyName)) {
        setSettings(_settings => ({
          ..._settings,
          generalSettings: { ..._settings.generalSettings, [keyName]: value },
        }));
      } else {
        setSettings(_settings => ({
          ..._settings,
          generalSettings: {
            ..._settings.generalSettings,
            [keyName]: { ..._settings.generalSettings?.[keyName], currentValue: value },
          },
        }));
      }
      const { generalSettings } = settings;
      setTouchedSettings(_settings => ({
        ..._settings,
        generalSettings: {
          ..._.mapValues(generalSettings, setting => setting.currentValue),
          trackingEnabled: generalSettings.trackingEnabled,
          volume: generalSettings.volume,
          [keyName]: value,
        },
      }));
    },
    [setSettings, setTouchedSettings, settings]
  );
  const setTimezone = useCallback(value => setGeneralSettingsItem('timezone', value), [
    setGeneralSettingsItem,
  ]);
  const setLanguage = useCallback(value => setGeneralSettingsItem('language', value), [
    setGeneralSettingsItem,
  ]);
  const setVolume = useCallback(value => setGeneralSettingsItem('volume', value), [
    setGeneralSettingsItem,
  ]);

  const openLocationHelp = useHelp(LOCATION_HELP);
  const openGeneralSettingsHelp = useHelp(GENERAL_SETTINGS_HELP);

  const retentionOptions = useMemo(
    () =>
      [30, 90, 180, 360, 720].map(value => ({
        label: `${value} ${formatMessage({ id: 'general.days' })}`,
        value,
      })),
    [formatMessage]
  );

  const availableTimezones = settings.generalSettings?.timezone?.available;
  const timezoneOptions = useMemo(
    () =>
      (availableTimezones ?? []).map(({ id, langKey }) => ({
        label: ucFirst({ id: `timezone.${langKey}` }),
        value: id,
      })),
    [availableTimezones, ucFirst]
  );

  const availableLanguages = settings.generalSettings?.language?.available;
  const languageOptions = useMemo(
    () =>
      (availableLanguages ?? []).map(({ id, langKey }) => ({
        label: ucFirst({ id: `deviceSettings.${langKey}` }),
        value: id,
      })),
    [availableLanguages, ucFirst]
  );

  if (_.isEmpty(settings)) {
    return null;
  }

  return (
    <View style={{ marginBottom: 200 }}>
      <View style={styles.row}>
        <Text style={{ fontSize: 14, maxWidth: '90%' }}>
          {ucFirst({ id: 'deviceSettings.generalSettings' })}
        </Text>
        <TouchableOpacity onPress={openGeneralSettingsHelp}>
          <AntDesign name='questioncircleo' size={22} />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsArea}>
        <View style={[styles.row, { zIndex: 2 }]}>
          <Text style={{ fontSize: 16 }}>{ucFirst({ id: 'general.timezone' })}</Text>
          <View style={{ width: '75%' }}>
            <DropdownSetting
              value={settings.generalSettings?.timezone?.currentValue ?? false}
              setValue={value => {
                setTimezone(value());
              }}
              items={timezoneOptions}
            />
          </View>
        </View>
        <View style={[styles.row, { zIndex: 1 }]}>
          <Text style={{ fontSize: 16 }}>{ucFirst({ id: 'general.language' })}</Text>
          <View style={{ width: '75%' }}>
            <DropdownSetting
              value={settings.generalSettings?.language?.currentValue ?? false}
              setValue={value => {
                setLanguage(value());
              }}
              items={languageOptions}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={{ fontSize: 16 }}>{ucFirst({ id: 'general.volume' })}</Text>
        </View>
        <View style={styles.row}>
          <Slider
            style={{ width: '100%', height: 40, marginTop: -20 }}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={settings.generalSettings?.volume}
            onValueChange={setVolume}
          />
        </View>
      </View>
      <View style={[styles.row, { zIndex: -1 }]}>
        <Text style={{ fontSize: 14, maxWidth: '90%' }}>
          {ucFirst({ id: 'deviceSettings.dataReportingAndRetention' })}
        </Text>
        <TouchableOpacity onPress={openLocationHelp}>
          <AntDesign name='questioncircleo' size={22} />
        </TouchableOpacity>
      </View>
      <View style={[styles.settingsArea, { zIndex: -1 }]}>
        <View style={styles.row}>
          <Text style={{ fontSize: 16 }}>
            {ucFirst({ id: 'dataReportingAndRetention.geolocationAllowed' })}
          </Text>
          <Switch
            value={settings.devicePermissions?.locationAllowed ?? false}
            onValueChange={setLocationAllowed}
          />
        </View>
        <View style={styles.row}>
          <Text style={{ fontSize: 16 }}>
            {ucFirst({ id: 'dataReportingAndRetention.emergencyGeolocationAllowed' })}
          </Text>
          <Switch
            value={settings.devicePermissions?.emergencyLocationAllowed ?? false}
            onValueChange={setEmergencyLocationAllowed}
          />
        </View>
        <View style={[styles.row]}>
          <Text style={{ fontSize: 16 }}>
            {ucFirst({ id: 'dataReportingAndRetention.retentionTime' })}
          </Text>
          <View style={{ width: '50%' }}>
            <DropdownSetting
              value={settings.devicePermissions?.dataRetentionDays ?? false}
              setValue={value => {
                setDataRetentionDays(value());
              }}
              items={retentionOptions}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const Stack = createStackNavigator();

const SettingsMain = () => (
  <SettingsContext.Consumer>
    {context => (
      <View style={{ height: '100%' }}>
        <SelectDevice />
        <ScrollView
          refreshControl={<RefreshControl onRefresh={context.fetchSettings} refreshing={false} />}
          contentContainerStyle={{ minHeight: '100%' }}
        >
          <Settings {...context} />
        </ScrollView>
        {!_.isEmpty(context.touchedSettings) && Platform.OS === 'android' && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: '90%',
              height: 50,
              margin: 10,
              marginLeft: '5%',
              marginBottom: 20,
              bottom: 0,
              borderRadius: 10,
              backgroundColor: actionColor,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={context.saveSettings}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {context.ucFirst({ id: 'general.save' })}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )}
  </SettingsContext.Consumer>
);

const SettingsHome = () => {
  const { ucFirst } = useFormatMessage();
  const [settings, setSettings] = useState({});
  const [touchedSettings, setTouchedSettings] = useState({});
  const { withSpinner } = useSpinner();
  const deviceId = useDeviceId();

  const fetchSettings = useCallback(async () => {
    if (deviceId) {
      await withSpinner(() => getDeviceSettings({ deviceId }).then(setSettings));
    }
  }, [deviceId, withSpinner]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings, deviceId]);

  const saveSettings = useCallback(async () => {
    await withSpinner(async () => {
      await saveDeviceSettings({ deviceId, settings: touchedSettings });
      await fetchSettings();
      setTouchedSettings({});
    });
  }, [deviceId, touchedSettings, fetchSettings, setTouchedSettings, withSpinner]);

  const getSaveButton = useCallback(
    () =>
      !_.isEmpty(touchedSettings) && Platform.OS === 'ios' ? (
        <View style={{ marginRight: 5 }}>
          <Button onPress={saveSettings} title={ucFirst({ id: 'general.save' })} />
        </View>
      ) : null,
    [touchedSettings, saveSettings, ucFirst]
  );

  return (
    <SettingsContext.Provider
      value={{
        fetchSettings,
        touchedSettings,
        saveSettings,
        setTouchedSettings,
        setSettings,
        settings,
        ucFirst,
      }}
    >
      <Stack.Navigator initialRouteName='SettingsMain'>
        <Stack.Screen
          name='SettingsMain'
          component={SettingsMain}
          options={{
            title: ucFirst({ id: 'deviceMenu.deviceSettings' }),
            headerRight: getSaveButton,
          }}
        />
      </Stack.Navigator>
    </SettingsContext.Provider>
  );
};

export default SettingsHome;
