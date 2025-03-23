import React, { createContext, useState } from 'react';
import { getAppName } from './database/simple_db';

interface AppContextProps {
  appName: string;
  setAppName: (appName: string) => void;
}

export const AppContext = createContext<AppContextProps>({
  appName: '',
  setAppName: () => {},
});

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appName, setAppName] = useState('Inventário');

  return (
    <AppContext.Provider value={{ appName, setAppName }}>
      {children}
    </AppContext.Provider>
  );
}; 