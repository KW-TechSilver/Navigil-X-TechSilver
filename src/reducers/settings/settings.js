const FILTER_DEFAULT_LENGTH = 8 * 60 * 60 * 1000; // 8h in ms

export const DEFAULT_FILTER = {
  endDate: new Date().getTime(),
  length: FILTER_DEFAULT_LENGTH,
};

const PRE_FILTER_DEFAULT_LENGTH = 8 * 60 * 60 * 1000; // 8h in ms

export const DEFAULT_PRE_FILTER = {
  endDate: new Date().getTime(),
  length: PRE_FILTER_DEFAULT_LENGTH,
};
