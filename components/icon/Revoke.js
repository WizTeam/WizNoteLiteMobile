/* eslint-disable */

import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { getIconColor } from './helper';

let Revoke = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M591.658667 808.661333c46.933333 0 86.954667-8.533333 120.192-25.514666 33.194667-16.981333 58.538667-40.96 75.946666-71.808 17.493333-30.890667 26.197333-66.986667 26.197334-108.373334 0-41.088-8.96-77.226667-26.837334-108.458666-17.92-31.232-43.733333-55.637333-77.482666-73.173334-33.792-17.536-74.666667-26.325333-122.666667-26.325333H383.018667l-73.301334 3.114667 57.301334-48.768 84.650666-83.029334a25.856 25.856 0 0 0 6.997334-9.344 31.445333 31.445333 0 0 0 2.346666-12.629333 30.72 30.72 0 0 0-8.533333-22.186667c-5.632-5.888-13.226667-8.832-22.826667-8.832a33.28 33.28 0 0 0-23.338666 9.685334l-182.613334 179.968a35.84 35.84 0 0 0-7.68 11.178666 31.232 31.232 0 0 0 0 25.344 32.128 32.128 0 0 0 7.68 10.837334l182.613334 179.968a32.725333 32.725333 0 0 0 23.338666 10.026666c9.557333 0 17.194667-2.986667 22.826667-8.832a31.146667 31.146667 0 0 0 8.533333-22.528 31.744 31.744 0 0 0-2.346666-12.501333 25.514667 25.514667 0 0 0-6.997334-9.472l-84.650666-82.986667-57.472-48.64 73.472 3.285334h207.317333c34.645333 0 63.872 5.973333 87.68 18.005333 23.765333 11.989333 41.813333 28.672 54.186667 50.005333 12.288 21.333333 18.474667 45.781333 18.474666 73.344 0 27.989333-6.186667 52.906667-18.517333 74.666667-12.330667 21.76-30.378667 38.912-54.186667 51.498667-23.765333 12.544-52.992 18.773333-87.637333 18.773333h-73.344a30.976 30.976 0 0 0-23.338667 9.386667 31.061333 31.061333 0 0 0-8.96 22.314666 31.445333 31.445333 0 0 0 32.298667 32h74.666667z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

Revoke.defaultProps = {
  size: 18,
};

Revoke = React.memo ? React.memo(Revoke) : Revoke;

export default Revoke;
