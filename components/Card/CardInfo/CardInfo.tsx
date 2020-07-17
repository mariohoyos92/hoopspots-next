import React from 'react';
import cx from 'classnames';

export const CardInfo: React.FC = ({ children }) => {
  return <dl>{children}</dl>;
};

export const CardInfoSection: React.FC<{ title: string; isFirst?: boolean }> = ({
  title,
  children,
  isFirst = false,
}) => {
  return (
    <div
      className={cx(
        { 'mt-8 sm:mt-0': !isFirst },
        { 'sm:border-t sm:border-gray-200': !isFirst },
        'sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5'
      )}
    >
      <dt className="text-sm leading-5 font-medium text-gray-500">{title}</dt>
      <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{children}</dd>
    </div>
  );
};

export default CardInfo;
