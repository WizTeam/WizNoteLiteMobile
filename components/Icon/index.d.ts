/* eslint-disable */

import { FunctionComponent } from 'react';
// Don't forget to install package: @types/react-native
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  name: 'formula' | 'quote' | 'code' | 'image' | 'table' | 'checkedBox' | 'link' | 'deletedLine' | 'italic' | 'bold' | 'insertColAfter' | 'insertColBefore' | 'insertRowBefore' | 'tag' | 'alignLeft' | 'alignRight' | 'dividingLine' | 'alignCenter' | 'insertRowAfter' | 'deleteTable' | 'bulletList' | 'deleteRow' | 'deleteCol' | 'codeBlock' | 'orderList' | 'inlineQuote';
  size?: number;
  color?: string | string[];
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
