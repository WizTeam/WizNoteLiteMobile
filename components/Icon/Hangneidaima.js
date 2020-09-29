/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let Hangneidaima = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M810.666667 213.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v426.666666a85.333333 85.333333 0 0 1-85.333333 85.333334H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V298.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h597.333334z m0 42.666667H213.333333a42.666667 42.666667 0 0 0-42.666666 42.666667v426.666666a42.666667 42.666667 0 0 0 42.666666 42.666667h597.333334a42.666667 42.666667 0 0 0 42.666666-42.666667V298.666667a42.666667 42.666667 0 0 0-42.666666-42.666667z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <Path
        d="M593.194667 330.965333L774.229333 512l-181.034666 181.034667-53.546667-53.546667 128.554667-128.554667-127.445334-127.488 52.48-52.48z m-170.666667 0l52.48 52.48-127.445333 127.488 128.554666 128.554667-53.589333 53.546667L241.536 512l180.992-181.034667z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </Svg>
  );
};

Hangneidaima.defaultProps = {
  size: 18,
};

Hangneidaima = React.memo ? React.memo(Hangneidaima) : Hangneidaima;

export default Hangneidaima;
