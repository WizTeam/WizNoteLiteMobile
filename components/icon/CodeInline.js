/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let CodeInline = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M536.32 256l41.216 11.050667-132.522667 494.506666-41.216-11.008L536.32 256z m-209.621333 17.493333L386.986667 333.824 206.08 514.858667 386.986667 695.893333l-60.330667 60.330667L85.333333 514.858667l60.330667-60.330667h0.085333l180.906667-181.034667z m333.994666-2.986666l241.365334 241.322666-241.365334 241.365334-60.330666-60.330667 181.034666-181.034667-181.034666-181.034666 60.330666-60.330667z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

CodeInline.defaultProps = {
  size: 18,
};

CodeInline = React.memo ? React.memo(CodeInline) : CodeInline;

export default CodeInline;
