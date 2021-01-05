/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let Angleleft = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M642.926 328.891 459.816 512l183.109 183.11c2.795 2.795 4.659 6.988 4.659 10.715 0 3.729-1.864 7.922-4.659 10.717l-23.297 23.297c-2.795 2.795-6.988 4.66-10.716 4.66s-7.921-1.865-10.717-4.66L381.074 522.715c-2.795-2.795-4.659-6.988-4.659-10.715 0-3.728 1.864-7.921 4.659-10.716l217.122-217.122c2.796-2.795 6.989-4.659 10.717-4.659s7.921 1.864 10.716 4.659l23.297 23.296c2.795 2.795 4.659 6.523 4.659 10.716C647.585 321.902 645.721 326.095 642.926 328.891z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

Angleleft.defaultProps = {
  size: 18,
};

Angleleft = React.memo ? React.memo(Angleleft) : Angleleft;

export default Angleleft;
