import { createContext, FC, ReactNode, useCallback, useState } from 'react';

const initialMode = 'light';

export type ThemeMode = 'light' | 'dark';

export const ThemeContext = createContext<{
  themeMode: ThemeMode;
  toggleMode: () => void;
}>(undefined!);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialMode);

  const toggleMode = useCallback(() => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
