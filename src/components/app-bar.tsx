import { FC, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/features/theme-toggle';
import { ThemeContext } from '@/contexts/theme-context';

export const AppBar: FC = () => {
  const { themeMode } = useContext(ThemeContext);

  return (
    <div
      className={`h-16 shadow-sm flex items-center justify-center ${
        themeMode === 'light' ? 'bg-white' : 'bg-black'
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
