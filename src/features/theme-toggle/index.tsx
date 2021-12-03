import { FC, useCallback, useContext } from 'react';
import { RiMoonClearFill,RiSunFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';

import { toggleThemeMode } from './slice';

export const ThemeToggle: FC = () => {
  const theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  const handleToggleClick = useCallback(() => {
    dispatch(toggleThemeMode());
  }, [dispatch]);

  return (
    <button
      className="w-16 h-16  text-2xl flex items-center justify-center hover:bg-blue hover:bg-opacity-80 fill-current text-gray hover:text-white transition-all"
      onClick={handleToggleClick}
    >
      <div>{theme.mode === 'light' ? <RiMoonClearFill /> : <RiSunFill />}</div>
    </button>
  );
};
