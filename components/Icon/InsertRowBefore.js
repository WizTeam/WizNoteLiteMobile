/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let InsertRowBefore = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M597.333333 554.666667v213.333333H170.666667v-42.666667h384v-128H170.666667v-42.666666h426.666666zM341.333333 234.666667v256l-170.666666-128 170.666666-128zM853.333333 256v213.333333H426.666667V256h426.666666z m-42.666666 42.666667h-341.333334v128h341.333334V298.666667z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

InsertRowBefore.defaultProps = {
  size: 18,
};

InsertRowBefore = React.memo ? React.memo(InsertRowBefore) : InsertRowBefore;

export default InsertRowBefore;
