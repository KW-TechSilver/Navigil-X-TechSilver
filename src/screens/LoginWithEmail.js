import React, { memo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button as PaperButton } from 'react-native-paper';
import DropdownLanguage from 'components/DropdownLanguage';
import useIntlContext from 'hooks/useIntlContext';
import useFormatMessage from 'hooks/useFormatMessage';
import { emailValidator, getAppEnv } from 'core/utils';
import { TextField } from 'rn-material-ui-textfield';
import { getBackgroundImage } from 'api/MiddlewareAPI';
import useSpinner from 'hooks/useSpinner';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  icon: {
    position: 'relative',
    marginBottom: 15,
    marginLeft: 'auto',
    marginRight: 2,
    marginTop: -40,
  },
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: '7%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textRow: {
    alignContent: 'center',
    paddingHorizontal: '2%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
  },
});

const LoginWithEmail = () => {
  const navigation = useNavigation();
  const spinner = useSpinner();
  const { setLocale, locale } = useIntlContext();
  const { ucFirst } = useFormatMessage();
  const displayEnv = getAppEnv();
  const [initEmail, setInitEmail] = useState({ value: '', error: '' });
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : -600;

  const _sendEmailPressed = async () => {
    const spinnerId = spinner.show();
    const emailError = emailValidator(initEmail.value);
    try {
      setInitEmail({ ...initEmail, error: emailError && ucFirst({ id: emailError }) });
      if (!emailError) {
        const response = await getBackgroundImage(initEmail.value);
        if (response) {
          const tempData = response[0];
          let domain;
          if (tempData.recordId === 'settings-0') {
            domain = `${displayEnv}.navigil.io`;
          } else {
            [, domain] = tempData.recordId.split('-');
          }
          if (domain) {
            navigation.navigate({
              name: 'LoginScreen',
              params: { initEmail, domain, imageData: response },
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
      if (err.code === 'UserNotFoundException') {
        // The error happens when the supplied username/email does not exist in the Cognito user pool
        setInitEmail({ ...initEmail, error: ucFirst({ id: 'login.UserNotFoundException' }) });
      }
    } finally {
      spinner.hide(spinnerId);
    }
  };

  return (
    <ImageBackground source={require('../../assets/splashScreen.png')} style={styles.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.textRow}>
          <View style={{ marginTop: -15 }}>
            <TextField
              label={ucFirst({ id: 'general.email' })}
              value={initEmail.value}
              onChangeText={text => setInitEmail({ value: text, error: '' })}
              autoCapitalize='none'
              autoCompleteType='email'
              textContentType='emailAddress'
              keyboardType='email-address'
            />
            <MaterialCommunityIcons name='email' size={20} color='#555' style={styles.icon} />
          </View>
          {initEmail.error ? <Text style={{ color: 'red' }}> {initEmail.error} </Text> : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}
        >
          <View style={{ flex: 1, alignSelf: 'flex-start', marginLeft: '-3%' }}>
            <DropdownLanguage locale={locale} setLocale={setLocale} />
          </View>
          <View style={{ flex: 5 }}>
            <PaperButton
              mode='contained'
              onPress={_sendEmailPressed}
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#2196f3',
                marginBottom: 30,
                justifyContent: 'center',
              }}
            >
              {ucFirst({ id: 'general.login' })}
            </PaperButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default memo(LoginWithEmail);
