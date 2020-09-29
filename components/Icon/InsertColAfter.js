/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let InsertColAfter = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M789.333333 682.666667l-128 170.666666-128-170.666666h256zM469.333333 426.666667v422.485333h-42.666666V469.333333H298.666667v384H256V426.666667h213.333333z m298.666667-256v426.666666h-213.333333V170.666667h213.333333z m-42.666667 42.666666h-128v341.333334h128V213.333333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

InsertColAfter.defaultProps = {
  size: 18,
};

InsertColAfter = React.memo ? React.memo(InsertColAfter) : InsertColAfter;

export default InsertColAfter;
