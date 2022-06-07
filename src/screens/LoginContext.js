import { createContext } from 'react';

export const LoginContext = createContext({ storedToken: {}, setStoredToken: () => {} });
