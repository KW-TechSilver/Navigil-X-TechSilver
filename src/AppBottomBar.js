import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Amplify, { Auth } from 'aws-amplify';
import { isEmpty } from 'lodash';
import { loadDeviceList, loadUserData, signIn, setBaseData, loadUserRoles } from 'actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import useIntlContext from 'hooks/useIntlContext';
import useFormatMessage from 'hooks/useFormatMessage';
import useUserCompany from 'hooks/useUserCompany';
import { DEFAULT_LOCALE } from 'i18n/date-fns';
import MapExample from 'components/MapSettings/MapView';
import { getAppEnv } from 'core/utils';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import usePushNotifications from './hooks/usePushNotifications';
import { getLocaleList, getLoginSettings } from './api/MiddlewareAPI';
import MyTable from './shared/components/DeviceList/DeviceListTable';
import WatchHome from './shared/components/WatchDashboard/WatchHome';
import MoreHome from './shared/components/More/MoreHome';
import Spinner from './components/Spinner';
import { LoginContext } from './screens/LoginContext';
import { RegisterScreen, ForgotPasswordScreen, LoginWithEmail, LoginScreen } from './screens';
import { getApiEnv } from '../aws-exports';
import NotificationsView from './shared/components/More/NotificationsView';
import useAmplifyHub from './hooks/useAmplifyHub';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const setEnvironment = env => {
  global.appEnv = env;
  const config = getApiEnv(env);
  Amplify.configure({ ...config });
  Auth.configure(config);
};
const ProfileContext = React.createContext({});

const Notifications = () => (
  <ProfileContext.Consumer>{context => <NotificationsView {...context} />}</ProfileContext.Consumer>
);

export const MyComponent = () => (
  <MenuProvider>
    <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
      <Menu>
        <MenuTrigger onPress={() => <MyComponent />}>
          <Entypo name='dots-three-horizontal' size={24} color='black' />
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={{ marginTop: 40 }}>
          <MenuOption onSelect={() => alert(`Save`)} text='LogIn' />
          <MenuOption onSelect={() => alert(`Delete`)}>
            <Text style={{ color: 'red' }}>LogOut</Text>
          </MenuOption>
          <MenuOption onSelect={() => alert(`Not called`)} disabled text='Disabled' />
        </MenuOptions>
      </Menu>
    </View>
  </MenuProvider>
);
function MyTabs() {
  const { ucFirst } = useFormatMessage();
  const { devices } = useSelector(store => ({
    devices: store.deviceList,
  }));

  return (
    <Tab.Navigator
      initialRouteName='Devices'
      tabBarOptions={{
        activeTintColor: 'black',
      }}
    >
      <Tab.Screen
        name='Dashboard'
        component={WatchHome}
        options={{
          tabBarLabel: ucFirst({ id: 'general.dashboard' }),
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons name='view-dashboard' color='black' size={size} />
          ),
        }}
      />
      {(devices?.length > 1 || devices?.length === undefined) && (
        <Tab.Screen
          name='Devices'
          component={MyTable}
          options={{
            tabBarLabel: ucFirst({ id: 'deviceMenu.devices' }),
            tabBarIcon: ({ size }) => (
              <MaterialCommunityIcons name='devices' color='black' size={size} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name='Map'
        component={MapExample}
        options={{
          tabBarLabel: ucFirst({ id: 'general.maps' }),
          tabBarIcon: ({ size }) => (
            <MaterialCommunityIcons name='map-marker' color='black' size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Notifications'
        component={Notifications}
        options={{
          tabBarLabel: ucFirst({ id: 'general.notifications' }),
          tabBarIcon: ({ size }) => <Ionicons name='notifications' size={size} />,
        }}
      />
      <Tab.Screen
        name='More'
        component={MoreHome}
        options={{
          tabBarLabel: ucFirst({ id: 'general.more' }),
          tabBarIcon: () => <Entypo name='dots-three-horizontal' size={24} color='black' />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppBottomBar({ setStoredToken }) {
  const navRef = useRef();
  const dispatch = useDispatch();

  useAmplifyHub();
  usePushNotifications(navRef);

  const {
    userToken,
    userData,
    spinner: { visible },
  } = useSelector(store => ({
    userToken: store.userToken,
    userData: store.userData,
    spinner: store.spinner,
  }));
  const [localeList, setLocaleList] = useState([]);
  const { setLocale, locale } = useIntlContext();

  useUserCompany();

  useEffect(() => {
    getLocaleList().then(setLocaleList);
  }, []);

  useEffect(() => {
    const userLocale = localeList.find(x => x.languageId === userData?.settings?.language);
    if (userLocale) {
      setLocale(userLocale.locale);
    }
  }, [userData, localeList, setLocale]);

  useEffect(() => {
    window.__localeId__ = locale ?? DEFAULT_LOCALE;
  }, [locale]);

  const signInCb = useCallback(
    user => {
      dispatch(signIn(user));
    },
    [dispatch]
  );

  const handleBaseData = useCallback(
    ({ data: [dataBase, dataHost] }) => {
      const _baseData = {};
      dataBase.forEach(row => {
        const { data, dataJson } = row;
        _baseData[row.settingName] = dataJson || data;
      });
      dataHost.forEach(row => {
        const { data, dataJson } = row;
        _baseData[row.settingName] = dataJson || data;
      });
      if (_baseData.language) {
        setLocale(_baseData.language);
      }
      if (typeof _baseData['default-location'] === 'string') {
        _baseData['default-location'] = JSON.parse(_baseData['default-location']);
      }
      dispatch(setBaseData(_baseData));
    },
    [dispatch, setLocale]
  );

  useEffect(() => {
    let user = null;
    const loadAuth = async () => {
      user = await Auth.currentAuthenticatedUser().catch(() =>
        console.log('User has not logged in')
      );
      if (user) {
        dispatch(loadDeviceList());
        dispatch(loadUserData(user?.username));
        dispatch(loadUserRoles());
        signInCb(user);
        const env = getAppEnv();
        const token = user.signInUserSession.accessToken.jwtToken;
        const object = {};
        object.validToken = token;
        object.validEnv = env;
        AsyncStorage.setItem('username', JSON.stringify(object));
        setStoredToken({ token, env });
      }
    };
    loadAuth();
    const loadLoginSettings = async () => {
      const _baseData = await getLoginSettings('localhost').catch(() =>
        console.log('Something wwent wrong with load Login Settings')
      );
      if (_baseData) {
        handleBaseData({ data: _baseData });
      }
    };
    loadLoginSettings();
  }, [dispatch, signInCb, userToken, setStoredToken, handleBaseData]);

  return (
    <LoginContext.Consumer>
      {({ storedToken }) => (
        <NavigationContainer independent ref={navRef}>
          <Spinner visible={visible} />
          <Stack.Navigator
            drawerContentOptions={{
              activeTintColor: '#e91e63',
              itemStyle: { padding: 0 },
            }}
            screenOptions={{
              headerShown: false,
            }}
          >
            {!isEmpty(storedToken) ? (
              <>
                <Stack.Screen name='Navigil' component={MyTabs} />
                {setEnvironment(storedToken?.env)}
              </>
            ) : (
              <>
                <Stack.Screen name='LoginWithEmail' options={{ headerShown: false }}>
                  {({ navigation }) => <LoginWithEmail navigation={navigation} />}
                </Stack.Screen>
                <Stack.Screen name='LoginScreen' options={{ headerShown: false }}>
                  {props => <LoginScreen {...props} signIn={signInCb} />}
                </Stack.Screen>
                <Stack.Screen
                  name='RegisterScreen'
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='ForgotPasswordScreen'
                  component={ForgotPasswordScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </LoginContext.Consumer>
  );
}
