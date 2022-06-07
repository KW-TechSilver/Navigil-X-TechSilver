import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';

const baseThemeObject = {
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { main: blue[500] },
    secondary: { main: lightBlue[500] },
  },
};

const theme = createMuiTheme(baseThemeObject);

export const createColorIntention = theme.palette.augmentColor;

const extendedPaletteObject = {
  ...theme.palette,
  danger: createColorIntention({ main: red[700] }),
  success: { ...createColorIntention({ main: green[500] }), contrastText: '#fff' },
  warning: createColorIntention({ main: amber[500] }),
  icons: { svg: { default: '#00000087' } },
};

theme.palette = { ...extendedPaletteObject };

export default theme;

export const createCustomTheme = customThemeObject =>
  createMuiTheme({
    ...baseThemeObject,
    ...customThemeObject,
    palette: { ...extendedPaletteObject, ...customThemeObject.palette },
  });
