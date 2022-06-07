import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useContext } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Auth } from '@aws-amplify/auth';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'actions';
import useFormatMessage from 'hooks/useFormatMessage';
import { TextField } from 'rn-material-ui-textfield';
import Dropdown from 'shared/components/Dropdown';
import { LoginContext } from 'screens/LoginContext';

const initializeData = userData =>
  _.pick(userData, ['id', 'companyId', 'firstName', 'lastName', 'phone', 'settings', 'role']);

const ProfileView = ({ languageItems, data, setData }) => {
  const { ucFirst } = useFormatMessage();
  const { userData } = useSelector(store => ({ userData: store.userData }));
  const { setStoredToken } = useContext(LoginContext);
  const dispatch = useDispatch();

  const clearAllData = React.useCallback(async () => {
    AsyncStorage.getAllKeys()
      .then(() => {
        AsyncStorage.removeItem('username');
        setStoredToken({});
        console.log('ProfileView AsyncStorage success');
      })
      .catch(error => console.log('error in ProfileView AsyncStorage', error));
  }, [setStoredToken]);

  const signOutCb = React.useCallback(async () => {
    Auth.signOut({ global })
      .then(() => dispatch(signOut()))
      .catch(error => console.log('error in signout', error));
    clearAllData();
  }, [clearAllData, dispatch]);

  const setDataProperty = useCallback(
    (keyName, value) => {
      if (!data) {
        setData({ ...initializeData(userData), [keyName]: value });
      } else {
        setData({ ...data, [keyName]: value });
      }
    },
    [setData, data, userData]
  );
  const setFirstName = useCallback(value => setDataProperty('firstName', value), [setDataProperty]);
  const setLastName = useCallback(value => setDataProperty('lastName', value), [setDataProperty]);
  const setPhone = useCallback(value => setDataProperty('phone', value), [setDataProperty]);
  const setLanguage = useCallback(value => setDataProperty('settings', { language: value() }), [
    setDataProperty,
  ]);

  useEffect(() => {
    setData();
  }, [setData, userData]);

  return (
    <View style={{ margin: 10 }}>
      <Text style={{ fontSize: 12, color: '#888' }}>{ucFirst({ id: 'general.language' })}</Text>
      <Dropdown
        items={languageItems}
        value={data?.settings?.language ?? userData?.settings?.language}
        setValue={setLanguage}
      />
      <TextField
        onChangeText={setFirstName}
        label={ucFirst({ id: 'general.firstName' })}
        value={data?.firstName ?? userData?.firstName}
      />
      <TextField
        onChangeText={setLastName}
        label={ucFirst({ id: 'general.lastName' })}
        value={data?.lastName ?? userData?.lastName}
      />
      <TextField
        onChangeText={setPhone}
        label={ucFirst({ id: 'general.phone' })}
        value={data?.phone ?? userData?.phone}
      />
      <TouchableOpacity onPress={signOutCb}>
        <View
          style={{
            backgroundColor: '#d32f2f',
            borderColor: '#d32f2f',
            borderRadius: 10,
            borderWidth: 1,
            alignContent: 'center',
            marginTop: 50,
          }}
        >
          <Text
            style={{
              color: 'white',
              margin: 10,
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: 18,
            }}
          >
            {ucFirst({ id: 'general.logout' })}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileView;
