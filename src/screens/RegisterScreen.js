import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useFormatMessage from 'hooks/useFormatMessage';
import Background from 'components/Background';
import Logo from 'components/Logo';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { theme } from 'core/theme';
import { emailValidator, passwordValidator, nameValidator } from 'core/utils';

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { ucFirst } = useFormatMessage();
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const _onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: ucFirst({ id: nameError }) });
      setEmail({ ...email, error: ucFirst({ id: emailError }) });
      setPassword({ ...password, error: ucFirst({ id: passwordError }) });
      return;
    }

    navigation.navigate('Dashboard');
  };

  return (
    <Background>
      <Logo />

      <TextInput
        label='Name'
        returnKeyType='next'
        value={name.value}
        onChangeText={text => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />

      <TextInput
        label='Email'
        returnKeyType='next'
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize='none'
        autoCompleteType='email'
        textContentType='emailAddress'
        keyboardType='email-address'
      />

      <TextInput
        label='Password'
        returnKeyType='done'
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <Button mode='contained' onPress={_onSignUpPressed} style={styles.button}>
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default memo(RegisterScreen);
