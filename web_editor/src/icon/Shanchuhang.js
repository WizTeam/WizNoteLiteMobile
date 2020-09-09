/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const Shanchuhang = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M128 256h682.666667v213.333333H128V256z m700.074667 275.541333l48.256 48.256-81.408 81.365334 81.536 81.578666-48.256 48.256-81.536-81.578666-81.493334 81.578666-48.298666-48.256 81.493333-81.578666-81.365333-81.365334 48.256-48.256 81.408 81.322667 81.408-81.322667zM554.666667 554.666667v213.333333H128v-213.333333h426.666667z m-42.666667 42.666666H170.666667v128h341.333333v-128z m256-298.666666v128H170.666667V298.666667h597.333333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

Shanchuhang.defaultProps = {
  size: 18,
};

export default Shanchuhang;
