import { format as formatFnc, startOfWeek as startOfWeekFnc } from 'date-fns';
import { da, de, enGB, enUS, es, fi, fr, it, ja, nl, nn, pl, pt, sv } from 'date-fns/locale';

export const DEFAULT_LOCALE = 'en-GB';

export const locales = {
  'da-DK': da,
  'de-DE': de,
  'en-US': enUS,
  'en-GB': enGB,
  'es-ES': es,
  'fi-FI': fi,
  'fr-FR': fr,
  'it-IT': it,
  'ja-JP': ja,
  'nl-NL': nl,
  'no-NO': nn,
  'pl-PL': pl,
  'pt-PT': pt,
  'sv-SE': sv,
};

export const localeStartOfWeekDay = (localeName = window.__localeId__) => {
  const locale = locales[localeName];
  return locale.options.weekStartsOn;
};

// by providing a default string of 'PP' or any of its variants for `formatStr`
// it will format dates in whichever way is appropriate to the locale
export const format = (date, formatStr = 'PP', options = {}) => {
  if (!date) {
    return null;
  }
  return formatFnc(date, formatStr, {
    locale: options?.locale || locales[window.__localeId__] || DEFAULT_LOCALE, // or global.__localeId__
  });
};

export const startOfWeek = (date, options = {}) => {
  if (!date) {
    return null;
  }
  return startOfWeekFnc(date, {
    locale: options?.locales || locales[window.__localeId__] || DEFAULT_LOCALE, // or global.__localeId__
    ...options,
  });
};

export const weekdays = (type = 'short') => {
  const locale = locales[window.__localeId__];
  const days = [...Array(7).keys()].map(i => locale.localize.day(i, { width: type }));
  const startOfWeekDay = localeStartOfWeekDay();
  if (startOfWeekDay) {
    const endOfWeekdays = days.splice(0, startOfWeekDay);
    endOfWeekdays.forEach(day => {
      days.push(day);
    });
  }
  return days;
};

export const months = (type = 'short') => {
  const locale = locales[window.__localeId__];
  return [...Array(12).keys()].map(i => locale.localize.month(i, { width: type }));
};

export default function(date, formatStr = 'PP', options = {}) {
  return format(date, formatStr, {
    locale: options.locale || locales[window.__localeId__] || DEFAULT_LOCALE, // or global.__localeId__
  });
}
