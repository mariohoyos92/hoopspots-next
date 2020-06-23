import React from 'react';

const Card: React.FC<{ className?: string }> = ({ children, className }) => (
  <div className={`bg-white overflow-hidden shadow sm:rounded-lg ${className}`}>{children}</div>
);

export default Card;
