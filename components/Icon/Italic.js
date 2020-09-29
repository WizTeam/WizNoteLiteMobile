/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let Italic = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M779.71 129.73V44.17H523.03v85.56h70.83L362.89 898.61h-96.54v85.56h256.68v-85.56H452.2l230.98-768.88z"
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
