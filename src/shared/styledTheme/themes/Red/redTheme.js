import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import { createCustomTheme } from '../Default/muiBaseTheme';

const palette = {
  primary: { main: red[300] },
  secondary: { main: orange[500] },
};
const theme = createCustomTheme({ palette });
theme.name = 'Red';

export default theme;
