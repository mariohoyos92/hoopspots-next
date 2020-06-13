import React, { ButtonHTMLAttributes } from 'react';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => {
  return (
    <button
      {...props}
      className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
