import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { ucFirst, titleCase } from 'change-case';

const useFormatMessage = () => {
  const { formatMessage, locale } = useIntl();

  const uppercaseFirst = useCallback(fmObject => ucFirst(formatMessage(fmObject)), [formatMessage]);

  const capitalizeWords = useCallback(fmObject => titleCase(formatMessage(fmObject)), [
    formatMessage,
  ]);

  return { formatMessage, ucFirst: uppercaseFirst, capitalizeWords, locale };
};

export default useFormatMessage;
