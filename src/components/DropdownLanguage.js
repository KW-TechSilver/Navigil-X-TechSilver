import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const localeList = [
  { value: 'da-DK', label: '🇩🇰' },
  { value: 'nl-NL', label: '🇳🇱' },
  { value: 'en-US', label: '🇺🇸' },
  { value: 'en-GB', label: '🇬🇧' },
  { value: 'fi-FI', label: '🇫🇮' },
  { value: 'fr-FR', label: '🇫🇷' },
  { value: 'de-DE', label: '🇩🇪' },
  { value: 'el-GR', label: '🇬🇷' },
  { value: 'it-IT', label: '🇮🇹' },
  { value: 'ja-JP', label: '🇯🇵' },
  { value: 'no-NO', label: '🇳🇴' },
  { value: 'pl-PL', label: '🇵🇱' },
  { value: 'pt-PT', label: '🇵🇹' },
  { value: 'sk-SK', label: '🇸🇰' },
  { value: 'es-ES', label: '🇪🇸' },
  { value: 'sv-SE', label: '🇸🇪' },
];

const DropdownLanguage = ({ locale, setLocale }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      maxHeight={270}
      showArrowIcon={false}
      items={localeList}
      open={open}
      setOpen={setOpen}
      listMode='SCROLLVIEW'
      value={locale}
      placeholder=''
      style={{
        backgroundColor: 'transparent',
        width: 50,
        borderWidth: 0,
        borderRadius: 0,
        marginTop: -10,
        marginLeft: 'auto',
      }}
      labelStyle={{ fontSize: 20 }}
      dropDownContainerStyle={{
        width: 70,
        right: 0,
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 1,
      }}
      setValue={value => {
        setLocale(value());
      }}
    />
  );
};

export default DropdownLanguage;
