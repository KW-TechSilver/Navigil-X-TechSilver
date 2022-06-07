import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';
import useIntlContext from 'hooks/useIntlContext';

const useHelp = (helpLink = '') => {
  const { baseData, companySettings } = useSelector(store => ({
    baseData: store.baseData,
    companySettings: store.userCompany.settings ?? {},
  }));
  const { docUrl } = companySettings;
  const { 'help-link': { address } = {}, noLanguage, noPath } = baseData;
  const { docLanguages, locale } = useIntlContext();
  const languagePath = noLanguage ? '' : `/${docLanguages[locale]}`;
  const path = noPath ? '' : helpLink;
  const fullLink = `${docUrl ?? address}${languagePath}${path}`;
  const open = useCallback(() => Linking.openURL(fullLink).catch(console.log), [fullLink]);
  return open;
};

export default useHelp;
