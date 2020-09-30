/* eslint-disable */

import { FunctionComponent } from 'react';
// Don't forget to install package: @types/react-native
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  name: 'bold' | 'table-delete-row' | 'insert-right' | 'bullet' | 'insert-under' | 'table' | 'link' | 'table-delete' | 'left' | 'title' | 'center' | 'strickthrough' | 'italic' | 'code-block' | 'right' | 'divide' | 'todolist' | 'quote' | 'code-inline' | 'table-delete-col' | 'insert-left' | 'orderlist' | 'insert-above' | 'image';
  size?: number;
  color?: string | string[];
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
