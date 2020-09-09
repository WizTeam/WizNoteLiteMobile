/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const Xieti = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M779.71 129.73V44.17H523.03v85.56h70.83L362.89 898.61h-96.54v85.56h256.68v-85.56H452.2l230.98-768.88z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

Xieti.defaultProps = {
  size: 18,
};

export default Xieti;
