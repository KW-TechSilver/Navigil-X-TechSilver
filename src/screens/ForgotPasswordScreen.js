import React, { memo, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { Auth } from 'aws-amplify';
import BackButton from 'components/BackButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useFormatMessage from 'hooks/useFormatMessage';
import { TextField } from 'rn-material-ui-textfield';
import { emailValidator } from 'core/utils';

const styles = StyleSheet.create({
  icon: {
    position: 'relative',
    marginBottom: 35,
    marginLeft: 'auto',
    marginTop: -40,
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
  textRow: {
    alignContent: 'center',
    padding: '3%',
  },
  mainView: {
    alignContent: 'center',
    padding: '2%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

const ForgotPasswordScreen = ({ route, navigation }) => {
  const { ucFirst } = useFormatMessage();
  const { bgUrl } = route.params;
  const [email, setEmail] = useState({ value: '', error: '' });
  const [sendCode, setSendCode] = useState(true);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : -300;

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError && ucFirst({ id: emailError }) });
    } else {
      setSendCode(false);
      Auth.forgotPassword(email.value)
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }
  };
  return (
    <>
      <ImageBackground source={bgUrl} style={styles.background}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior='padding'
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <BackButton goBack={() => navigation.navigate('LoginScreen')} />
          {sendCode ? (
            <View style={{ marginTop: 100 }}>
              <View style={styles.mainView}>
                <Text style={{ alignSelf: 'center', fontSize: 24, marginBottom: 20 }}>
                  {ucFirst({ id: 'general.resetYourPassword' })}
                </Text>

                <View style={styles.textRow}>
                  <View style={{ marginBottom: -20 }}>
                    <TextField
                      label={ucFirst({ id: 'general.email' })}
                      value={email.value}
                      onChangeText={text => {
                        setEmail({ value: text, error: '' });
                      }}
                      autoCapitalize='none'
                      autoCompleteType='email'
                      textContentType='emailAddress'
                      keyboardType='email-address'
                    />
                    <MaterialCommunityIcons
                      name='email'
                      size={20}
                      color='#555'
                      style={styles.icon}
                    />
                  </View>
                  {email.error ? <Text style={{ color: 'red' }}> {email.error} </Text> : null}
                </View>
              </View>

              <View style={{ display: 'flex', width: '100%', paddingVertical: 10 }}>
                <PaperButton
                  mode='contained'
                  onPress={_onSendPressed}
                  style={{
                    alignSelf: 'center',
                    backgroundColor: '#2196f3',
                    marginBottom: 30,
                    justifyContent: 'center',
                  }}
                >
                  {ucFirst({ id: 'general.sendCode' })}
                </PaperButton>
              </View>
            </View>
          ) : (
            <View style={styles.mainView}>
              <Text style={{ alignSelf: 'center', fontSize: 24 }}>
                {ucFirst({ id: 'general.pleaseCheckYourEmail' })}
                <Text> </Text>
                <Text
                  style={{ alignSelf: 'center', fontSize: 24, marginBottom: 50, color: 'blue' }}
                >
                  {email.value}
                </Text>
                <Text> </Text>
                <Text style={{ textTransform: 'lowercase' }}>
                  {ucFirst({ id: 'general.toGetMoreInformation' })}{' '}
                </Text>
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
};

export default memo(ForgotPasswordScreen);
