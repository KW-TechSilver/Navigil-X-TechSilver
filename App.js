import React, { Suspense, useState, useEffect } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Text, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideBar from 'components/SideBar';
import configureStore from 'store/configureStore';
import RafaelProviders from 'providers/ContextsProviders';
import { wrappers } from 'context/wrappers';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import { version } from './package.json';
import config from './aws-exports';
import 'intl';
import 'intl/locale-data/jsonp/en'; // or any other locale you needimport { LogBox } from "react-native";
import AppBottomBar from './src/AppBottomBar';
import { LoginContext } from './src/screens/LoginContext';

LogBox.ignoreLogs(['Remote debugger']);
const store = configureStore();
const queryClient = new QueryClient();
Amplify.configure({ ...config });
Auth.configure(config);
LogBox.ignoreLogs(['Setting a timer', 'VirtualizedLists should never be nested']);

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

Sentry.init({
  dsn: 'SENTRY_DSN',
  enableInExpoDevelopment: true,
  debug: true,
  initialScope: { tags: { navigilversion: version } },
  release: Constants.manifest.revisionId,
});

const App = () => {
  const [storedToken, setStoredToken] = useState();
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('username');
        const parseValue = JSON.parse(value);
        if (value !== null) {
          // value previously stored
          setStoredToken(tempData => ({
            ...tempData,
            token: parseValue.validToken,
            env: parseValue.validEnv,
          }));
        }
      } catch (e) {
        // error reading value
        console.log('AsyncStorage in App.js', e);
      }
    };
    getData();
  }, []);

  return (
    <LoginContext.Provider value={{ storedToken, setStoredToken }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RafaelProviders wrappers={wrappers}>
            <Suspense>
              <SideBar />
              <AppBottomBar setStoredToken={setStoredToken} />
            </Suspense>
          </RafaelProviders>
        </QueryClientProvider>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'dark'} />
      </Provider>
    </LoginContext.Provider>
  );
};

export default App;
