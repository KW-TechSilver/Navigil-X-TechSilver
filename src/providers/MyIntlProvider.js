import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'intl';
import 'intl/locale-data/jsonp/en-GB'; // for Android only
import { IntlProvider } from 'react-intl';
import IntlContext from 'context/IntlContext';
import { DEFAULT_LOCALE } from 'i18n/date-fns';
import { getI18nMessages, getLocaleList } from 'api/MiddlewareAPI';

const flattenMessages = (nestedMessages, prefix = '') =>
  Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});

const useLocales = () => {
  const [localeList, setLocaleList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [allLanguages, setAllLanguages] = useState({});
  const [docLanguages, setDocLanguages] = useState({});

  useEffect(() => {
    const fetchLanguageList = async () => {
      try {
        const _languageList = await getLocaleList();
        setLanguageList(_languageList);
        const _allLanguages = {};
        const _docLanguages = {};
        _languageList.forEach(language => {
          _allLanguages[language.languageId] = language;
          if (language.published) {
            _docLanguages[language.locale] = language.docLanguage;
          }
        });
        setAllLanguages(_allLanguages);
        setDocLanguages(_docLanguages);
      } catch (error) {
        alert('FAILED TO GET LANGUAGELIST');
      }
    };
    fetchLanguageList();
  }, []);

  useEffect(() => {
    if (languageList) {
      const _localeList = languageList.filter(lang => lang.published).map(lang => lang.locale);
      setLocaleList(_localeList);
    }
  }, [languageList]);
  return { localeList, allLanguages, docLanguages };
};

const MyIntlProvider = ({ children }) => {
  const [locale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [newLocale, setLocale] = useState(DEFAULT_LOCALE);
  // const [localeIndex, setLocaleIndex] = useState(0);
  const [messages, setMessages] = useState();

  const fetchMessages = useCallback(async () => {
    try {
      const _messages = await getI18nMessages();
      setMessages(_messages);
    } catch (error) {
      alert('FAILED TO GET TRANSLATIONS');
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const { localeList: locales, allLanguages, docLanguages } = useLocales();

  useEffect(() => {
    window.__localeId__ = locale;
  }, [locale]);

  useEffect(() => {
    if (locales.find(item => item === newLocale)) {
      setCurrentLocale(newLocale);
    } else {
      setCurrentLocale(DEFAULT_LOCALE);
    }
  }, [locales, newLocale]);

  if (!messages) {
    return null;
  }

  return (
    <IntlProvider
      locale={locale}
      messages={flattenMessages(messages[locale])}
      defaultLocale={locale}
    >
      <IntlContext.Provider
        value={{
          setLocale,
          locale,
          locales,
          allLanguages,
          docLanguages,
          reFetchMessages: fetchMessages,
        }}
      >
        {children}
      </IntlContext.Provider>
    </IntlProvider>
  );
};

export default MyIntlProvider;

MyIntlProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};
