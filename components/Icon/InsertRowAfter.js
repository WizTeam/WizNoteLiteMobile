/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let InsertRowAfter = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M341.333333 533.333333v256l-170.666666-128 170.666666-128z m512 21.333334v213.333333H426.666667v-213.333333h426.666666z m-42.666666 42.666666h-341.333334v128h341.333334v-128z m-213.333334-341.333333v213.333333H170.666667v-42.666666h384V298.666667H170.666667V256h426.666666z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

InsertRowAfter.defaultProps = {
  size: 18,
};

InsertRowAfter = React.memo ? React.memo(InsertRowAfter) : InsertRowAfter;

export default InsertRowAfter;
