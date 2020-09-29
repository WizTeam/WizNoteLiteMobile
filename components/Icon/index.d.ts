/* eslint-disable */

import { FunctionComponent } from 'react';
// Don't forget to install package: @types/react-native
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';

interface Props extends GProps, ViewProps {
  name: 'gongshi_putong' | 'zu1' | 'cc-code' | 'image' | 'zu' | 'xuanzekuang' | 'lianjie' | 'shanchuxianstrikethrough2' | 'xieti' | 'cuti' | 'charulie_you' | 'charulie_zuo' | 'charuhang_shang' | 'jinghao' | 'duiqifangshi_zuo' | 'duiqifangshi_you' | 'fengexian' | 'duiqifangshi_zhong' | 'charuhang_xia' | 'shanchubiaoge' | 'wuxuliebiao' | 'shanchuhang' | 'shanchulie' | 'hangneidaima' | 'youxuliebiao' | 'yinyong';
  size?: number;
  color?: string | string[];
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
