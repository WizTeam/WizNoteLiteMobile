/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let BulletList = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M384 345.6h426.666667a42.666667 42.666667 0 0 0 0-85.333333H384a42.666667 42.666667 0 0 0 0 85.333333z m426.666667 128H384a42.666667 42.666667 0 0 0 0 85.333333h426.666667a42.666667 42.666667 0 0 0 0-85.333333z m0 213.333333H384a42.666667 42.666667 0 0 0 0 85.333334h426.666667a42.666667 42.666667 0 0 0 0-85.333334zM217.6 256a46.933333 46.933333 0 1 0 0 93.866667 46.933333 46.933333 0 0 0 0-93.866667z m0 213.333333a46.933333 46.933333 0 1 0 0 93.866667 46.933333 46.933333 0 0 0 0-93.866667z m0 213.333334a46.933333 46.933333 0 1 0 0 93.866666 46.933333 46.933333 0 0 0 0-93.866666z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

BulletList.defaultProps = {
  size: 18,
};

BulletList = React.memo ? React.memo(BulletList) : BulletList;

export default BulletList;
