import { FC } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeToggle } from '@/features/theme-toggle';
import { RootState } from '@/store';

export const AppBar: FC = () => {
  const theme = useSelector((state: RootState) => state.theme);

  return (
    <div
      className={`h-16 shadow-sm flex items-center justify-center ${
        theme.mode === 'light' ? 'bg-white' : 'bg-black'
      }`}
    >
      <Link href="/">
        <a>
          <Image
            src="/logo.png"
            width="262"
            height="41"
            alt="Monthly Reminders"
          />
        </a>
      </Link>
      <div className="absolute right-4">
        <ThemeToggle />
      </div>
    </div>
  );
};
