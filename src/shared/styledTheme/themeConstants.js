import DEFAULT from './themes/Default/nsBaseTheme';
import BLUE from './themes/Blue/blueTheme';
import RED from './themes/Red/redTheme';
import ORANGE from './themes/Orange/orangeTheme';

export const THEMES = [DEFAULT, BLUE, RED, ORANGE];

export const THEME_NAMES = THEMES.map(theme => theme.name);

export const VARIANT_NAMES = [
  'initial',
  'primary',
  'secondary',
  'warning',
  'success',
  'danger',
  'error',
];
