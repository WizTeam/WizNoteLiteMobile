/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let DeleteCol = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M256 128h213.333333v682.666667H256V128z m486.741333 489.216l48.256 48.298667-81.408 81.322666 81.536 81.578667-48.256 48.256-81.536-81.578667-81.493333 81.578667-48.298667-48.256 81.493334-81.578667-81.365334-81.322666 48.256-48.298667 81.408 81.365333 81.408-81.365333zM426.666667 170.666667v597.333333H298.666667V170.666667h128z m341.333333-42.325334v426.666667h-213.333333v-426.666667h213.333333z m-42.666667 42.666667h-128v341.333333h128v-341.333333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

DeleteCol.defaultProps = {
  size: 18,
};

DeleteCol = React.memo ? React.memo(DeleteCol) : DeleteCol;

export default DeleteCol;
