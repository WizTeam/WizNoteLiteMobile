/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let CharulieZuo = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M768 426.666667v422.485333h-42.666667V469.333333h-128v384h-42.666666V426.666667h213.333333z m-277.333333 256l-128 170.666666-128-170.666666h256zM469.333333 170.666667v426.666666H256V170.666667h213.333333z m-42.666666 42.666666H298.666667v341.333334h128V213.333333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

CharulieZuo.defaultProps = {
  size: 18,
};

CharulieZuo = React.memo ? React.memo(CharulieZuo) : CharulieZuo;

export default CharulieZuo;
