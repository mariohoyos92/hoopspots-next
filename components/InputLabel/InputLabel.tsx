import React, { LabelHTMLAttributes } from 'react';

const InputLabel: React.FC<LabelHTMLAttributes<HTMLLabelElement>> = props => {
  const { children } = props;
  return (
    <label {...props} className="block text-sm font-medium leading-5 text-gray-700">
      {children}
    </label>
  );
};

export default InputLabel;
