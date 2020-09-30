/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let Italic = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M597.333333 213.461333L512 810.666667h128v42.666666H298.666667v-42.666666h128.128l85.333333-597.205334H597.333333zM725.333333 170.666667v42.666666H384V170.666667h341.333333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

Italic.defaultProps = {
  size: 18,
};

Italic = React.memo ? React.memo(Italic) : Italic;

export default Italic;
