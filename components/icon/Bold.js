/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let Bold = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M256 170.666667h277.333333a192 192 0 0 1 138.922667 324.565333A192 192 0 0 1 576 853.333333H256V170.666667z m309.12 384H362.752v192.170666h202.368a96.085333 96.085333 0 1 0 0-192.170666z m-40.106667-277.333334h-162.133333v170.666667h162.133333a85.333333 85.333333 0 1 0 0-170.666667z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

Bold.defaultProps = {
  size: 18,
};

Bold = React.memo ? React.memo(Bold) : Bold;

export default Bold;
