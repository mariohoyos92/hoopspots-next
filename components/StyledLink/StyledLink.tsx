import React from 'react';

const StyledLink: React.ForwardRefExoticComponent<{
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}> = React.forwardRef(({ children, onClick, href }, ref) => (
  <a
    href={href}
    onClick={onClick}
    // @ts-ignore
    ref={ref}
    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
  >
    {children}
  </a>
));

export default StyledLink;
