import React from 'react';

type Props = {
  imageUrl: string;
  size?: string;
  className?: string;
};

const Avatar: React.FC<Props> = ({ size = 12, imageUrl, className }) => (
  <img className={`inline-block h-${size} w-${size} rounded-full ${className}`} src={imageUrl} alt="avatar" />
);

export default Avatar;
