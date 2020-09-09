/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const CharulieZuo = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M768 426.666667v422.485333h-42.666667V469.333333h-128v384h-42.666666V426.666667h213.333333z m-277.333333 256l-128 170.666666-128-170.666666h256zM469.333333 170.666667v426.666666H256V170.666667h213.333333z m-42.666666 42.666666H298.666667v341.333334h128V213.333333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

CharulieZuo.defaultProps = {
  size: 18,
};

export default CharulieZuo;
