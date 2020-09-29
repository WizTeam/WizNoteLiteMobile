/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let Table = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M139.636364 698.181818h189.952v186.181818H139.636364z m283.136 0h186.181818v186.181818h-186.181818z m279.272727 0H884.363636v186.181818h-182.365091zM139.636364 418.909091h189.952v186.181818H139.636364z m283.089454 0h186.181818v186.181818h-186.181818z m279.272727 0H884.363636v186.181818h-182.365091zM139.636364 139.636364h189.952v186.181818H139.636364z m283.089454 0h186.181818v186.181818h-186.181818z m279.272727 0H884.363636v186.181818h-182.365091z m0-93.090909H46.545455v930.90909h930.90909V46.545455z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

Table.defaultProps = {
  size: 18,
};

Table = React.memo ? React.memo(Table) : Table;

export default Table;
