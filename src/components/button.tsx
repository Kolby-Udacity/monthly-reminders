import { FC, ReactNode } from 'react';

export const Button: FC<{ children: ReactNode; onClick: () => void }> = ({
  children,
  onClick,
}) => {
  return (
    <button
      className="bg-white rounded-lg shadow-md hover:shadow-lg active:shadow-sm transition-shadow"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
