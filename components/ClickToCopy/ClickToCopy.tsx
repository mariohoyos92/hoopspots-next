import React, { useState } from 'react';
import copy from 'copy-to-clipboard';

const ClickToCopy: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [addressCopied, setAddressCopied] = useState(false);
  function onCopy() {
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 2000);
  }
  return (
    <button
      className="flex items-center text-gray-400"
      onClick={() => copy(textToCopy, { message: 'Click to copy to clipboard', format: 'text/plain', onCopy })}
    >
      {!addressCopied ? (
        <>
          {' '}
          <div className="h-5 w-5">
            <svg
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
            </svg>
          </div>
          Copy
        </>
      ) : (
        <>
          <div className="h-5 w-5">
            <svg
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
          </div>
          Copied
        </>
      )}
    </button>
  );
};

export default ClickToCopy;
