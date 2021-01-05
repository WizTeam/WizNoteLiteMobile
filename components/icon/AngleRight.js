/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let AngleRight = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M624.865 512.247L332.71 220.088c-12.28-12.27-12.28-32.186 0-44.457 12.27-12.28 32.186-12.28 44.457 0l314.388 314.388c12.28 12.27 12.28 32.186 0 44.457L377.167 848.863c-6.136 6.14-14.183 9.211-22.228 9.211s-16.092-3.071-22.228-9.211c-12.28-12.27-12.28-32.186 0-44.457l292.155-292.16z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

AngleRight.defaultProps = {
  size: 18,
};

AngleRight = React.memo ? React.memo(AngleRight) : AngleRight;

export default AngleRight;
