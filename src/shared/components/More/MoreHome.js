import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useFormatMessage from 'hooks/useFormatMessage';
import useHelp from 'hooks/useHelp';
import useInUserGroups from 'hooks/useInUserGroups';
import { loadUserData } from 'actions';
import { updateUserData, getLanguageList } from 'api/MiddlewareAPI';
import { createStackNavigator } from '@react-navigation/stack';
import { EvilIcons, MaterialCommunityIcons, Ionicons, AntDesign } from 'react-native-vector-icons';
import useSpinner from 'hooks/useSpinner';
import SettingsHome from 'shared/components/Settings/SettingsHome';
import GeofenceEditorWrapper from 'components/GeofenceEditor/GeofenceEditorWrapper';

import About from './About';
import ProfileView from './ProfileView';
import MoreSettings from './Settings';

const ProfileContext = React.createContext({});

const Profile = () => (
  <ProfileContext.Consumer>{context => <ProfileView {...context} />}</ProfileContext.Consumer>
);

const NavRow = ({ onPress, languageKey, children }) => {
  const { ucFirst } = useFormatMessage();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 10,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '15%' }}>
          <View style={{ marginLeft: '20%' }}>{children}</View>
        </View>
        <View style={{ width: '80%' }}>
          <Text style={{ fontSize: 17 }}>{ucFirst({ id: languageKey })}</Text>
        </View>
        <View>
          <MaterialCommunityIcons size={23} name='chevron-right' />
        </View>
      </View>
    </TouchableOpacity>
  );
};

function MoreMain({ navigation }) {
  const { ucFirst } = useFormatMessage();
  const { userData } = useSelector(store => ({ userData: store.userData }));
  const openHelp = useHelp();
  const [isNavigilAdmin] = useInUserGroups('NavigilAdmin', 'NavigilRoot', 'CompanyAdmin');

  const navToProfile = useCallback(() => navigation.navigate('Profile'), [navigation]);
  const navToSettings = useCallback(() => navigation.navigate('DeviceSettings'), [navigation]);
  const navToAbout = useCallback(() => navigation.navigate('About'), [navigation]);
  const openSettings = useCallback(() => navigation.navigate('Settings'), [navigation]);
  const navToGeofenceEditor = useCallback(() => navigation.navigate('GeofenceEdit'), [navigation]);

  return (
    <ScrollView contentContainerStyle={{ minHeight: '100%' }} nestedScrollEnabled>
      <View style={{ margin: 5, marginTop: 15 }}>
        <Text>{ucFirst({ id: 'general.profile' })}</Text>
      </View>
      <TouchableOpacity onPress={navToProfile}>
        <View
          style={{
            backgroundColor: 'white',
            marginBottom: 5,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '15%' }}>
            <EvilIcons name='user' size={50} />
          </View>
          <View style={{ width: '80%' }}>
            <Text style={{ fontSize: 16 }}>
              {userData.firstName} {userData.lastName}
            </Text>
            <Text style={{ fontSize: 15 }}>{userData.email}</Text>
          </View>
          <View>
            <MaterialCommunityIcons size={23} name='chevron-right' />
          </View>
        </View>
      </TouchableOpacity>
      <NavRow onPress={navToSettings} languageKey='deviceMenu.deviceSettings'>
        <MaterialCommunityIcons name='cog-outline' color='black' size={25} />
      </NavRow>
      <NavRow onPress={navToAbout} languageKey='general.about'>
        <Ionicons name='information-circle' size={25} />
      </NavRow>
      <NavRow onPress={openHelp} languageKey='general.help'>
        <AntDesign name='questioncircleo' size={25} />
      </NavRow>
      {isNavigilAdmin && (
        <NavRow onPress={openSettings} languageKey='general.settings'>
          <AntDesign name='setting' size={25} />
        </NavRow>
      )}
      <NavRow onPress={navToGeofenceEditor} languageKey='deviceSettings.safetyfenceEditor'>
        <MaterialCommunityIcons name='map' size={25} />
      </NavRow>
    </ScrollView>
  );
}

const Stack = createStackNavigator();
const makeLanguageItems = items =>
  items?.map(({ id, languageNameOrig }) => ({ label: languageNameOrig, value: id }));

const MoreHome = () => {
  const { withSpinner } = useSpinner();
  const [isNavigilAdmin] = useInUserGroups('NavigilAdmin', 'NavigilRoot', 'CompanyAdmin');

  const { ucFirst } = useFormatMessage();
  const dispatch = useDispatch();
  const { userData } = useSelector(store => ({
    userData: store.userData,
  }));
  const { email } = userData;
  const [data, setData] = useState();
  const [notifications, setNotifications] = useState();
  const [languageItems, setLanguageItems] = useState([]);

  const fetchUser = useCallback(() => {
    if (email) {
      dispatch(loadUserData(email));
    }
  }, [email, dispatch]);

  const saveUser = useCallback(async () => {
    await withSpinner(() => updateUserData(data));
    fetchUser();
  }, [fetchUser, data, withSpinner]);

  const getSaveSettingsButton = useCallback(
    () =>
      data ? (
        <View style={{ marginRight: 5 }}>
          <Button onPress={saveUser} title={ucFirst({ id: 'general.save' })} />
        </View>
      ) : null,
    [data, saveUser, ucFirst]
  );

  useEffect(() => {
    dispatch(loadUserData(email));
    getLanguageList().then(items => setLanguageItems(makeLanguageItems(items)));
  }, [dispatch, email]);

  return (
    <ProfileContext.Provider
      value={{ data, setData, notifications, setNotifications, languageItems }}
    >
      <Stack.Navigator initialRouteName='MoreMain'>
        <Stack.Screen
          name='MoreMain'
          component={MoreMain}
          options={{ title: ucFirst({ id: 'general.more' }) }}
        />
        <Stack.Screen
          name='Profile'
          component={Profile}
          options={{
            title: ucFirst({ id: 'general.profile' }),
            headerRight: getSaveSettingsButton,
          }}
        />
        <Stack.Screen
          name='DeviceSettings'
          component={SettingsHome}
          options={{
            title: ucFirst({ id: 'deviceMenu.deviceSettings' }),
            headerShown: false,
          }}
        />
        {isNavigilAdmin && (
          <Stack.Screen
            name='Settings'
            component={MoreSettings}
            options={{
              title: ucFirst({ id: 'general.settings' }),
            }}
          />
        )}
        <Stack.Screen
          name='About'
          component={About}
          options={{
            title: 'About',
          }}
        />
        <Stack.Screen
          name='GeofenceEdit'
          component={GeofenceEditorWrapper}
          options={{
            title: ucFirst({ id: 'deviceSettings.safetyfenceEditor' }),
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </ProfileContext.Provider>
  );
};

export default MoreHome;
