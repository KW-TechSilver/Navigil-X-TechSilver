import Constants from 'expo-constants';

export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'schemaMessages.emailIsInvalid';
  if (!re.test(email)) return 'schemaMessages.emailIsInvalid';

  return '';
};

// TODO: For better validation use something like libphonenumber
export const phoneNumberValidator = number => {
  const re = /^\d{8,}$/;

  if (!number?.length) return 'user.invalidPhoneNumber';
  if (!re.test(number)) return 'user.invalidPhoneNumber';

  return '';
};

export const passwordValidator = password => {
  if (!password || password.length <= 0) return 'schemaMessages.passwordIsInvalid';

  return '';
};

export const nameValidator = name => {
  if (!name || name.length <= 0) return 'schemaMessages.nameCannotBeEmpty';

  return '';
};

export const getAppEnv = () => global.appEnv ?? Constants.manifest.extra.appEnv ?? 'dev';
