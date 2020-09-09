/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const Zu1 = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M46.545455 907.450182v-814.545455h93.090909v814.545455z m218.763636-63.162182v-93.090909h557.242182v93.090909z m0-297.472v-93.090909h557.242182v93.090909z m0-297.472v-93.090909h708.747636v93.090909z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

Zu1.defaultProps = {
  size: 18,
};

export default Zu1;
