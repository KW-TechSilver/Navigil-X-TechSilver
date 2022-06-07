import _ from 'lodash';
import { StyleSheet, TouchableOpacity, View, Text, Switch } from 'react-native';
import { TextField } from 'rn-material-ui-textfield';
import { Entypo } from 'react-native-vector-icons';
import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { actionColor } from 'core/theme';
import useFormatMessage from 'hooks/useFormatMessage';
import { emailValidator, nameValidator, phoneNumberValidator } from 'core/utils';
import Dropdown from 'shared/components/Dropdown';
import PrimaryButton from 'shared/components/PrimaryButton';
import { getNotificationsList } from './util';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    padding: 10,
  },
  modalContent: {
    marginTop: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
  },
  modalFormControl: {
    marginTop: 20,
  },
  submitButton: {
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
  modalFormButton: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: '#999',
    borderWidth: 1,
    marginRight: 10,
    height: 30,
  },
});

const addNotification = ({
  notifications: { current, ...rest },
  name,
  receiver,
  notificationType,
  userId,
  channel,
  promptConnect,
}) => {
  if (_.includes(['email', 'call'], channel)) {
    return {
      ...rest,
      current: {
        ...current,
        [notificationType]: {
          ...(current?.[notificationType] ?? {}),
          [channel]: [
            ...(current?.[notificationType]?.[channel] ?? []),
            { name, receiver, userId, ...(channel === 'call' && { promptConnect }) },
          ],
        },
      },
    };
  }
  throw new Error('Invalid channel');
};

const AddDeviceNotificationModal = ({ closeModal, notifications, setNotifications }) => {
  const { ucFirst } = useFormatMessage();
  const {
    userData: { id: userId },
  } = useSelector(store => ({ userData: store.userData }));

  const [channel, setChannel] = useState('email');
  const [notificationType, setNotificationType] = useState();
  const [name, setName] = useState();
  const [receiver, setReceiver] = useState();
  const [promptConnect, setPromptConnect] = useState(true);
  const [errors, setErrors] = useState({});

  const notificationTypes = useMemo(
    () =>
      (notifications?.available?.[channel] ?? []).map(value => ({
        value,
        label: ucFirst({ id: `notificationType.${value}` }),
      })),
    [ucFirst, channel, notifications]
  );
  const existingNotifications = useMemo(() => getNotificationsList(notifications), [notifications]);

  const setChannelActive = useCallback(value => {
    setReceiver();
    setErrors({});
    setChannel(value);
  }, []);
  const setCallActive = useCallback(() => setChannelActive('call'), [setChannelActive]);
  const setEmailActive = useCallback(() => setChannelActive('email'), [setChannelActive]);
  const setReceiverEmail = useCallback(value => setReceiver(value.toLowerCase()), []);
  const setReceiverPhone = useCallback(value => setReceiver(value.replace(/\D/g, '')), []);

  const submit = useCallback(async () => {
    const _errors = {};

    _errors.notificationType = !notificationType && 'schemaMessages.isRequired';
    _errors.name = nameValidator(name);
    _errors.receiver =
      (channel === 'email' && emailValidator(receiver)) ||
      (channel === 'call' && phoneNumberValidator(receiver)) ||
      (!_.isEmpty(
        existingNotifications.filter(
          x =>
            x.receiver.toLowerCase() === receiver.toLowerCase() &&
            x.notificationType === notificationType &&
            x.channel === channel
        )
      ) &&
        'general.duplicate');

    if (!_.isEmpty(_.pickBy(_errors, _.identity))) {
      return setErrors(_.mapValues(_errors, id => (id ? ucFirst({ id }) : '')));
    }

    setNotifications(
      addNotification({
        notifications,
        name,
        receiver,
        notificationType,
        channel,
        userId,
        promptConnect,
      })
    );

    closeModal();
  }, [
    existingNotifications,
    ucFirst,
    closeModal,
    name,
    notificationType,
    notifications,
    receiver,
    setNotifications,
    userId,
    channel,
    promptConnect,
  ]);

  if (!notifications?.available) {
    return null;
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <TouchableOpacity
              onPress={setEmailActive}
              style={[
                styles.modalFormButton,
                channel === 'email' && { backgroundColor: actionColor, color: '#fff' },
              ]}
            >
              <Text style={channel === 'email' ? { color: '#fff' } : { color: '#333' }}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={setCallActive}
              style={[
                styles.modalFormButton,
                channel === 'call' && { backgroundColor: actionColor },
              ]}
            >
              <Text style={channel === 'call' ? { color: '#fff' } : { color: '#333' }}>Call</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={closeModal}>
              <Entypo name='cross' size={25} style={{ color: '#333' }} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.modalFormControl, { zIndex: 1 }]}>
          <Text style={{ fontSize: 16 }}>{ucFirst({ id: 'deviceSettings.alarmType' })}</Text>
          <Dropdown
            items={notificationTypes}
            value={notificationType}
            setValue={setNotificationType}
            style={{
              height: 50,
              marginBottom: -20,
              borderColor: errors.notificationType ? 'rgb(213, 0, 0)' : 'transparent',
              borderWidth: 2,
              borderRadius: 5,
            }}
          />
        </View>
        <View style={styles.modalFormControl}>
          <TextField
            onChangeText={setName}
            label={ucFirst({ id: 'deviceSettings.recipientName' })}
            value={name}
            placeholder={ucFirst({ id: 'general.johnDoe' })}
            textContentType='name'
            error={errors.name}
            helperText={errors.name}
          />
        </View>
        {channel === 'email' && (
          <View style={styles.modalFormControl}>
            <TextField
              onChangeText={setReceiverEmail}
              label={ucFirst({ id: 'deviceSettings.recipientEmail' })}
              value={receiver}
              placeholder='john.doe@xyz.com...'
              textContentType='emailAddress'
              error={errors.receiver}
              helperText={errors.receiver}
              inputProps={{ style: { textTransform: 'lowercase' } }}
              keyboardType='email-address'
            />
          </View>
        )}
        {channel === 'call' && (
          <View style={styles.modalFormControl}>
            <TextField
              onChangeText={setReceiverPhone}
              label={ucFirst({ id: 'deviceSettings.recipientPhone' })}
              value={_.isNil(receiver) ? undefined : `+${receiver}`}
              placeholder='+35801234567...'
              textContentType='telephoneNumber'
              error={errors.receiver}
              helperText={errors.receiver}
              keyboardType='numeric'
            />
          </View>
        )}
        {channel === 'call' && (
          <View style={styles.modalFormControl}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16 }}>
                {ucFirst({ id: 'deviceSettings.promptConnect' })}
              </Text>
              <Switch value={promptConnect} onValueChange={setPromptConnect} />
            </View>
          </View>
        )}
        <View style={styles.modalFormControl}>
          <PrimaryButton onPress={submit} style={styles.submitButton}>
            <Text style={styles.buttonText}>{ucFirst({ id: 'general.add' })}</Text>
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
};

export default AddDeviceNotificationModal;
