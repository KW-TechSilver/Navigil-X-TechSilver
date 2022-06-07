import amber from '@material-ui/core/colors/amber';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { createCustomTheme } from '../Default/muiBaseTheme';

const palette = {
  primary: { main: deepOrange[500] },
  secondary: { main: amber[500] },
};
const theme = createCustomTheme({ palette });
theme.name = 'Orange';

export default theme;
