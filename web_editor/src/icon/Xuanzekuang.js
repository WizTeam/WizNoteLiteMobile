/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const Xuanzekuang = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M188 158c-16.569 0-30 13.431-30 30v648c0 16.569 13.431 30 30 30h648c16.569 0 30-13.431 30-30V188c0-16.569-13.431-30-30-30H188z m0-60h648c49.706 0 90 40.294 90 90v648c0 49.706-40.294 90-90 90H188c-49.706 0-90-40.294-90-90V188c0-49.706 40.294-90 90-90z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M273.802 434.186c-11.683-11.748-30.678-11.8-42.426-0.115-11.747 11.683-11.8 30.678-0.115 42.426L427.34 673.645c11.684 11.748 30.679 11.8 42.426 0.116 11.748-11.684 11.8-30.679 0.116-42.426l-196.08-197.15z"
        fill={getIconColor(color, 1, '#333333')}
      />
      <path
        d="M792.38 373.542c12.136-11.279 12.83-30.261 1.551-42.398-11.28-12.136-30.261-12.83-42.398-1.551l-323.73 300.872c-12.137 11.28-12.832 30.262-1.552 42.398 11.28 12.137 30.262 12.831 42.398 1.552l323.73-300.873z"
        fill={getIconColor(color, 2, '#333333')}
      />
    </svg>
  );
};

Xuanzekuang.defaultProps = {
  size: 18,
};

export default Xuanzekuang;
