import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const baseStyles =
  'w-full max-w-screen-sm flex items-center bg-white rounded-lg shadow-md hover:shadow-lg active:shadow-sm transition-shadow';

const getContent = (text: string) => {
  return (
    <>
      <div className="-ml-12">
        <Image
          src="/folder.png"
          width="131"
          height="120"
          quality={100}
          alt=""
        />
      </div>
      <h3 className="ml-4">{text}</h3>
    </>
  );
};

export const IconButton: FC<{ text: string; onClick: () => void }> = ({
  text,
  onClick,
}) => {
  return (
    <button className={baseStyles} onClick={onClick}>
      {getContent(text)}
    </button>
  );
};

export const IconLink: FC<{ text: string; href: string }> = ({
  text,
  href,
}) => {
  return (
    <Link href={href}>
      <a className={baseStyles}>{getContent(text)}</a>
    </Link>
  );
};
