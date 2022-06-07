import { FC, useCallback, useContext } from 'react';
import { RiMoonClearFill, RiSunFill } from 'react-icons/ri';

import { ThemeContext } from '@/contexts/theme-context';

export const ThemeToggle: FC = () => {
  const { themeMode, toggleMode } = useContext(ThemeContext);

  const handleToggleClick = useCallback(() => {
    toggleMode();
  }, [toggleMode]);

  return (
    <button
      className="w-16 h-16  text-2xl flex items-center justify-center hover:bg-blue hover:bg-opacity-80 fill-current text-gray hover:text-white transition-all"
      onClick={handleToggleClick}
      aria-label="Toggle dark mode"
    >
      <div>{themeMode === 'light' ? <RiMoonClearFill /> : <RiSunFill />}</div>
    </button>
  );
};
