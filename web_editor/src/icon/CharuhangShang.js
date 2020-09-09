/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const CharuhangShang = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M597.333333 554.666667v213.333333H170.666667v-42.666667h384v-128H170.666667v-42.666666h426.666666zM341.333333 234.666667v256l-170.666666-128 170.666666-128zM853.333333 256v213.333333H426.666667V256h426.666666z m-42.666666 42.666667h-341.333334v128h341.333334V298.666667z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

CharuhangShang.defaultProps = {
  size: 18,
};

export default CharuhangShang;
