/* eslint-disable */

import { CSSProperties, DOMAttributes, FunctionComponent } from 'react';

interface Props extends DOMAttributes<SVGElement> {
  name: 'gongshi_putong' | 'zu1' | 'cc-code' | 'image' | 'zu' | 'xuanzekuang' | 'lianjie' | 'shanchuxianstrikethrough2' | 'xieti' | 'cuti' | 'charulie_you' | 'charulie_zuo' | 'charuhang_shang' | 'jinghao' | 'duiqifangshi_zuo' | 'duiqifangshi_you' | 'fengexian' | 'duiqifangshi_zhong' | 'charuhang_xia' | 'shanchubiaoge' | 'wuxuliebiao' | 'shanchuhang' | 'shanchulie' | 'hangneidaima' | 'youxuliebiao' | 'yinyong';
  size?: number;
  color?: string | string[];
  style?: CSSProperties;
  className?: string;
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
