/* eslint-disable */

import { FunctionComponent } from 'react';
// Don't forget to install package: @types/react-native
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

declare const Strickthrough: FunctionComponent<Props>;

export default Strickthrough;
