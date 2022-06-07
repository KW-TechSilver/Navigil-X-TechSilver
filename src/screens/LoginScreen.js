import React, { memo, useState, useEffect, useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { sample } from 'lodash';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Amplify, { Auth } from 'aws-amplify';
import useIntlContext from 'hooks/useIntlContext';
import useFormatMessage from 'hooks/useFormatMessage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button as PaperButton } from 'react-native-paper';
import DropdownLanguage from 'components/DropdownLanguage';
import { theme, actionColor } from 'core/theme';
import { emailValidator, passwordValidator, getAppEnv } from 'core/utils';
import { TextField } from 'rn-material-ui-textfield';
import useSpinner from 'hooks/useSpinner';
import Logo from 'components/Logo';
import { getApiEnv } from '../../aws-exports';

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  row: {
    display: 'flex',
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  label: {
    color: theme.colors.secondary,
    alignSelf: 'center',
  },
  link: {
    fontWeight: 'bold',
    color: 'blue',
    paddingRight: 10,
    alignSelf: 'center',
  },
  icon: {
    position: 'relative',
    marginBottom: 15,
    marginLeft: 'auto',
    marginRight: 2,
    marginTop: -40,
  },
  dropDown: {
    position: 'relative',
    marginLeft: 'auto',
    justifyContent: 'flex-end',
  },
  environmentButtons: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  environmentButton: {
    backgroundColor: actionColor,
    borderColor: 'transparent',
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    paddingHorizontal: '8%',
    alignContent: 'center',
  },
  environmentButtonText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'white',
    fontSize: 18,
    margin: 5,
  },
  mainView: {
    flex: 1,
    paddingHorizontal: '1%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textRow: {
    alignContent: 'center',
    paddingHorizontal: '5%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingBottom: 10,
  },
  logo: {
    marginLeft: Dimensions.get('screen').height * 0.001,
    marginBottom: Dimensions.get('screen').height * 0.001,
    marginTop: Dimensions.get('screen').height * 0.05,
  },
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: '4%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

const setEnvironment = (env, forceUpdate) => {
  global.appEnv = env;
  const config = getApiEnv(env);
  Amplify.configure({ ...config });
  Auth.configure(config);
  forceUpdate(_x => _x + 1);
};

const EnvironmentButton = ({ env, displayEnv, forceUpdate }) => (
  <View>
    <TouchableOpacity
      style={[styles.environmentButton, displayEnv === env ? { backgroundColor: 'purple' } : {}]}
      onPress={() => setEnvironment(env, forceUpdate)}
    >
      <Text style={styles.environmentButtonText}>{env === 'ustest' ? 'usa' : env}</Text>
    </TouchableOpacity>
  </View>
);

function LoginScreen({ route, navigation, signIn: signInCb }) {
  const { initEmail, domain, imageData } = route.params;
  const { setLocale, locale } = useIntlContext();
  const { ucFirst } = useFormatMessage();
  const spinner = useSpinner();
  const [email, setEmail] = useState(initEmail);
  const [password, setPassword] = useState({ value: '', error: '' });
  const [envSettings, setEnvSettings] = useState();
  const [bgUrl, setBgUrl] = useState();
  const [logoUrl, setLogoUrl] = useState();
  const [showEnvButtons, setShowEnvButtons] = useState();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : -200;

  const displayEnv = getAppEnv();
  const [, forceUpdate] = useState(0);
  const getData = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('allEnv');
      const parseValue = JSON.parse(value);

      if (value !== null) {
        setEnvSettings(parseValue);
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  }, []);

  const processImages = useCallback((tempBackgroundData, tempDomain) => {
    for (let index = 0; index < tempBackgroundData.length; index++) {
      const element = tempBackgroundData[index];
      if (element.settingName === 'hdr-image') {
        const tempLogo = element.DATA;
        setLogoUrl({
          uri: 'https://'.concat(tempDomain).concat(tempLogo),
        });
      } else if (element.settingName === 'bg-image') {
        const tempBackground = JSON.parse(element.DATA);
        const bgImage = sample(tempBackground);
        setBgUrl({ uri: 'https://'.concat(tempDomain).concat(bgImage) });
      } else {
        const tempShowEnv = !!element.status;
        setShowEnvButtons(!tempShowEnv);
      }
    }
  }, []);

  useEffect(() => {
    getData();
    processImages(imageData, domain);
  }, [imageData, domain, getData, processImages]);

  const _onLoginPressed = async () => {
    const spinnerId = spinner.show();
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    try {
      setEmail({ ...email, error: emailError && ucFirst({ id: emailError }) });
      setPassword({ ...password, error: passwordError && ucFirst({ id: passwordError }) });
      if (emailError || passwordError) {
        return;
      }
      const data = await Auth.signIn(email.value, password.value);
      signInCb(data);
    } catch (err) {
      console.log('err.code', err.code);
      console.log('err.message', err.message);
      if (err.code === 'UserNotConfirmedException') {
        await Auth.resendSignUp(email.value);
      } else if (err.code === 'NotAuthorizedException') {
        // The error happens when the incorrect password is provided
        setPassword({ ...email, error: ucFirst({ id: 'login.UserNotFoundException' }) });
      } else if (err.code === 'UserNotFoundException') {
        // The error happens when the supplied username/email does not exist in the Cognito user pool
        setEmail({ ...email, error: ucFirst({ id: 'login.UserNotFoundException' }) });
      } else {
        setPassword({ ...email, error: err.code });
        throw new Error(err);
      }
    } finally {
      spinner.hide(spinnerId);
    }
  };
  const _onResetPasswordPressed = async () => {
    const spinnerId = spinner.show();
    try {
      navigation.navigate({
        name: 'ForgotPasswordScreen',
        params: { bgUrl, logoUrl },
      });
    } catch (err) {
      console.log('err.code', err.code);
    } finally {
      spinner.hide(spinnerId);
    }
  };

  if (!bgUrl || !logoUrl) {
    return <View />;
  }
  return (
    <ImageBackground source={bgUrl} style={styles.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.logo}>
          <Logo url={logoUrl} />
        </View>
        <View style={styles.mainView}>
          <StatusBar currentHeight={Constants.statusBarHeight} />
          {envSettings || showEnvButtons ? (
            <>
              <View style={styles.environmentButtons}>
                <EnvironmentButton env='dev' displayEnv={displayEnv} forceUpdate={forceUpdate} />
                <EnvironmentButton
                  env='navigiltest'
                  displayEnv={displayEnv}
                  forceUpdate={forceUpdate}
                />
                <EnvironmentButton env='test' displayEnv={displayEnv} forceUpdate={forceUpdate} />
              </View>
              <View style={styles.environmentButtons}>
                <EnvironmentButton env='ustest' displayEnv={displayEnv} forceUpdate={forceUpdate} />
                <EnvironmentButton env='prod' displayEnv={displayEnv} forceUpdate={forceUpdate} />
              </View>
            </>
          ) : (
            <View style={styles.environmentButtons}>
              <Text />
            </View>
          )}
          <View style={styles.textRow}>
            <Text style={{ alignSelf: 'center', fontSize: 24, paddingTop: 5, marginBottom: -5 }}>
              {ucFirst({ id: 'general.loginTitle' })}
            </Text>
            <TextField
              label={ucFirst({ id: 'general.email' })}
              value={email.value}
              onChangeText={text => setEmail({ value: text, error: '' })}
              autoCapitalize='none'
              autoCompleteType='email'
              textContentType='emailAddress'
              keyboardType='email-address'
            />
            <MaterialCommunityIcons name='email' size={20} color='#555' style={styles.icon} />
            {email.error ? <Text style={{ color: 'red' }}> {email.error} </Text> : null}
            <TextField
              label={ucFirst({ id: 'general.password' })}
              value={password.value}
              onChangeText={text => setPassword({ value: text, error: '' })}
              secureTextEntry
            />
            <MaterialCommunityIcons name='lock' size={20} color='#555' style={styles.icon} />
            {password.error ? <Text style={{ color: 'red' }}> {password.error} </Text> : null}
            <DropdownLanguage locale={locale} setLocale={setLocale} />
            <View style={{ display: 'flex', width: '100%' }}>
              <PaperButton
                mode='contained'
                onPress={_onLoginPressed}
                style={{
                  alignSelf: 'center',
                  backgroundColor: '#2196f3',
                  justifyContent: 'center',
                }}
              >
                {ucFirst({ id: 'general.login' })}
              </PaperButton>
            </View>
            <View style={styles.row}>
              <TouchableOpacity onPress={_onResetPasswordPressed}>
                <Text style={styles.label}>{`${ucFirst({
                  id: 'general.forgotPassword',
                })}?`}</Text>
                <Text style={styles.link}> {`${ucFirst({ id: 'general.resetPassword' })}`}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default memo(LoginScreen);
