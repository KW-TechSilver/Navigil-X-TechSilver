import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import { createColorIntention, createCustomTheme } from '../Default/muiBaseTheme';

const danger = createColorIntention({ main: red[600] });
const success = createColorIntention({ main: green[600] });
const warning = createColorIntention({ main: amber[600] });

const palette = {
  primary: { main: blue[500] },
  secondary: { main: teal[500] },
  danger,
  success,
  warning,
};
const theme = createCustomTheme({ palette });
theme.name = 'Blue';

export default theme;
