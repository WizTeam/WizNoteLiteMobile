/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let Zu1 = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M46.545455 907.450182v-814.545455h93.090909v814.545455z m218.763636-63.162182v-93.090909h557.242182v93.090909z m0-297.472v-93.090909h557.242182v93.090909z m0-297.472v-93.090909h708.747636v93.090909z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

Zu1.defaultProps = {
  size: 18,
};

Zu1 = React.memo ? React.memo(Zu1) : Zu1;

export default Zu1;
