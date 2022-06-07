import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import Background from 'components/Background';
import Logo from 'components/Logo';

const styles = StyleSheet.create({
  homePage: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 10,
    marginLeft: 5,
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    marginLeft: 5,
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').width * 0.7,
  },
  privacyPage: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 10,
    marginLeft: 5,
  },
  hideElement: {
    display: 'none',
  },
  copyRightPage: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 10,
    marginLeft: 5,
  },
  desc: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 10,
    marginLeft: 5,
  },
  logo: {
    marginRight: Dimensions.get('screen').height * 0.15,
    marginBottom: Dimensions.get('screen').height * 0.14,
    marginTop: Dimensions.get('screen').height * -0.1,
  },
  infoText: {
    fontSize: 15,
    padding: 5,
    textDecorationStyle: 'solid',
    textDecorationColor: 'blue',
    textDecorationLine: 'underline',
    color: 'blue',
  },
  infoTextContainer: {
    width: '65%',
  },
});

const About = () => {
  const { userCompany } = useSelector(store => ({
    userCompany: store.userCompany,
  }));

  const { settings, webSettings, name: companyName } = userCompany;

  const urlLogo = {
    uri: 'https://'.concat(settings.domain).concat(webSettings.hdrImage?.data),
  };

  const openInfoPages = useCallback(
    () => Linking.openURL(settings.appInfoLink).catch(console.log),
    [settings.appInfoLink]
  );

  const openHomePages = useCallback(
    () => Linking.openURL(webSettings.homePageLink?.data).catch(console.log),
    [webSettings.homePageLink]
  );

  const openPrivacyPages = useCallback(
    () => Linking.openURL(webSettings.privacyLink?.data).catch(console.log),
    [webSettings.privacyLink]
  );

  const openCopyRightPages = useCallback(
    () => Linking.openURL(webSettings.copyLink?.data).catch(console.log),
    [webSettings.copyLink]
  );

  if (!userCompany) return null;

  return (
    <Background domain={settings.domain} bgImageData={webSettings.bgImage?.dataJson}>
      <View style={styles.logo}>
        <Logo url={urlLogo} />
      </View>
      <View style={styles.info}>
        <View>
          <View style={styles.desc}>
            <Text>{settings.appAboutText} </Text>
          </View>
          <View style={settings.appInfoTitle ? styles.privacyPage : styles.hideElement}>
            <TouchableOpacity onPress={openInfoPages}>
              <Text style={styles.infoText}>{settings.appInfoTitle}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.homePage}>
            <TouchableOpacity onPress={openHomePages}>
              <Text style={styles.infoText}>
                {webSettings.homePagesFooterTitle?.data || webSettings.homePagesText?.data}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.privacyPage}>
            <TouchableOpacity onPress={openPrivacyPages}>
              <Text style={styles.infoText}>{webSettings.privacyText?.data}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.copyRightPage}>
            <TouchableOpacity onPress={openCopyRightPages}>
              {companyName === 'Navigil' ? (
                <Text style={styles.infoText}>
                  &copy;{1900 + new Date().getYear()} {webSettings.copyText?.data}
                </Text>
              ) : (
                <Text style={styles.infoText}>{webSettings.copyText?.data}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default About;
