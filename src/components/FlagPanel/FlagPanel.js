import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { IconButton, Button, Menu, Provider } from 'react-native-paper';
import useIntlContext from 'hooks/useIntlContext';
import * as flags from './flags';
import Flag from './Flag';

const FlagPanel = () => {
  const [visible, setVisible] = useState(false);
  const [, setAnchorEl] = useState(null);
  const { setLocale, locales, locale } = useIntlContext();

  const [flagNames, setFlagNames] = useState([]);
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const _flagNames = locales.map(localeName => localeName.replace(/-/g, ''));
    setFlagNames(_flagNames);
  }, [locales]);

  const switchLocale = language => {
    handleClose();
    const newLocale = `${language.slice(0, 2)}-${language.slice(2)}`;
    setLocale(newLocale);
  };

  const currentLocale = locale.replace('-', '');
  const otherLanguages = Object.keys(flags).filter(
    flag => flag !== currentLocale && flagNames.includes(flag)
  );
  return (
    <Provider>
      <View
        style={{
          paddingTop: 50,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onPress={e => {
            setAnchorEl(e.currentTarget);
          }}
        >
          <Flag language={currentLocale} />
        </IconButton>
      </View>
      <View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu}>Show menu</Button>}
        >
          {otherLanguages.map(language => (
            <Menu.Item
              key={language}
              onPress={() => switchLocale(language)}
              title={<Flag key={language} language={language} backgroundColor='red' />}
            >
              <IconButton
                size='small'
                onPress={e => {
                  setAnchorEl(e.currentTarget);
                }}
              />
            </Menu.Item>
          ))}
        </Menu>
      </View>
    </Provider>
  );
};

export default FlagPanel;
