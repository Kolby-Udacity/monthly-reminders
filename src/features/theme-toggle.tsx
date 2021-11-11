import { ThemeContext } from '@/contexts/theme-context';
import { FC, useCallback, useContext } from 'react';
import { RiSunFill, RiMoonClearFill } from 'react-icons/ri';

export const ThemeToggle: FC = () => {
  const { themeMode, toggleMode } = useContext(ThemeContext);

  const handleToggleClick = useCallback(() => {
    toggleMode();
  }, [toggleMode]);

  return (
    <button
      className="w-16 h-16  text-2xl flex items-center justify-center hover:bg-blue hover:bg-opacity-80 fill-current text-gray hover:text-white transition-all"
      onClick={handleToggleClick}
    >
      <div>{themeMode === 'light' ? <RiMoonClearFill /> : <RiSunFill />}</div>
    </button>
  );
};
