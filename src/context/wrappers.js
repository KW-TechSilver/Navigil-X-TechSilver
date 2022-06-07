import MyIntlProvider from 'providers/MyIntlProvider';
import { Provider as PaperProvider } from 'react-native-paper';

// Context wrapping components - order First->Last = Parent->Child

export const wrappers = [MyIntlProvider, PaperProvider];
