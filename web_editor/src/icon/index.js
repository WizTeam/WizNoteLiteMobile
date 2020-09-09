/* eslint-disable */

import React from 'react';
import GongshiPutong from './GongshiPutong';
import Zu1 from './Zu1';
import CcCode from './CcCode';
import Image from './Image';
import Zu from './Zu';
import Xuanzekuang from './Xuanzekuang';
import Lianjie from './Lianjie';
import Shanchuxianstrikethrough2 from './Shanchuxianstrikethrough2';
import Xieti from './Xieti';
import Cuti from './Cuti';
import CharulieYou from './CharulieYou';
import CharulieZuo from './CharulieZuo';
import CharuhangShang from './CharuhangShang';
import Jinghao from './Jinghao';
import DuiqifangshiZuo from './DuiqifangshiZuo';
import DuiqifangshiYou from './DuiqifangshiYou';
import Fengexian from './Fengexian';
import DuiqifangshiZhong from './DuiqifangshiZhong';
import CharuhangXia from './CharuhangXia';
import Shanchubiaoge from './Shanchubiaoge';
import Wuxuliebiao from './Wuxuliebiao';
import Shanchuhang from './Shanchuhang';
import Shanchulie from './Shanchulie';
import Hangneidaima from './Hangneidaima';
import Youxuliebiao from './Youxuliebiao';
import Yinyong from './Yinyong';

const IconFont = ({ name, ...rest }) => {
  switch (name) {
    case 'gongshi_putong':
      return <GongshiPutong {...rest} />;
    case 'zu1':
      return <Zu1 {...rest} />;
    case 'cc-code':
      return <CcCode {...rest} />;
    case 'image':
      return <Image {...rest} />;
    case 'zu':
      return <Zu {...rest} />;
    case 'xuanzekuang':
      return <Xuanzekuang {...rest} />;
    case 'lianjie':
      return <Lianjie {...rest} />;
    case 'shanchuxianstrikethrough2':
      return <Shanchuxianstrikethrough2 {...rest} />;
    case 'xieti':
      return <Xieti {...rest} />;
    case 'cuti':
      return <Cuti {...rest} />;
    case 'charulie_you':
      return <CharulieYou {...rest} />;
    case 'charulie_zuo':
      return <CharulieZuo {...rest} />;
    case 'charuhang_shang':
      return <CharuhangShang {...rest} />;
    case 'jinghao':
      return <Jinghao {...rest} />;
    case 'duiqifangshi_zuo':
      return <DuiqifangshiZuo {...rest} />;
    case 'duiqifangshi_you':
      return <DuiqifangshiYou {...rest} />;
    case 'fengexian':
      return <Fengexian {...rest} />;
    case 'duiqifangshi_zhong':
      return <DuiqifangshiZhong {...rest} />;
    case 'charuhang_xia':
      return <CharuhangXia {...rest} />;
    case 'shanchubiaoge':
      return <Shanchubiaoge {...rest} />;
    case 'wuxuliebiao':
      return <Wuxuliebiao {...rest} />;
    case 'shanchuhang':
      return <Shanchuhang {...rest} />;
    case 'shanchulie':
      return <Shanchulie {...rest} />;
    case 'hangneidaima':
      return <Hangneidaima {...rest} />;
    case 'youxuliebiao':
      return <Youxuliebiao {...rest} />;
    case 'yinyong':
      return <Yinyong {...rest} />;

  }

  return null;
};

export default IconFont;
