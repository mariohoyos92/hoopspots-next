import React from 'react';
import cx from 'classnames';

export const CardHeader: React.FC<{ title: string; description?: string; className?: string }> = ({
  title,
  description,
  className,
}) => (
  <div className={`bg-white px-4 py-5 border-b border-gray-200 sm:px-6 ${className}`}>
    <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    {description ? <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p> : null}
  </div>
);

export const CardHeaderWithAvatars: React.FC<{ title: string; description: string; avatarUrls: string[] }> = ({
  title,
  description,
  avatarUrls,
}) => (
  <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
    <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-no-wrap">
      <div className="ml-4 mt-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>
      </div>
      <div className="ml-4 mt-4 flex-shrink-0">
        <div className="flex relative z-0 overflow-hidden items-center">
          <p className="mr-2">
            {avatarUrls.length} Hooper{avatarUrls.length > 1 ? 's' : ''}:
          </p>
          {avatarUrls.map((url, i) => (
            <img
              className={cx(
                { '-ml-2': i > 0 },
                `z-${30 - i * 10} relative inline-block h-10 w-10 rounded-full text-white shadow-solid`
              )}
              src={url}
              alt="profile avatar"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);
