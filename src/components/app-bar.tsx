import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const AppBar: FC = () => {
  return (
    <div className="bg-white h-16 shadow-sm flex items-center justify-center">
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
    </div>
  );
};
