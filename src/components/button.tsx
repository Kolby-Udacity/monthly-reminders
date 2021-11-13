import { ButtonHTMLAttributes, FC } from 'react';

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      className="bg-white rounded-lg shadow-md hover:shadow-lg active:shadow-sm transition-shadow"
    >
      {props.children}
    </button>
  );
};
