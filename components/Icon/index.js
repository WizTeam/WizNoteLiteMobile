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

let IconFont = ({ name, ...rest }) => {
  switch (name) {
    case 'gongshi_putong':
      return <GongshiPutong key="1" {...rest} />;
    case 'zu1':
      return <Zu1 key="2" {...rest} />;
    case 'cc-code':
      return <CcCode key="3" {...rest} />;
    case 'image':
      return <Image key="4" {...rest} />;
    case 'zu':
      return <Zu key="5" {...rest} />;
    case 'xuanzekuang':
      return <Xuanzekuang key="6" {...rest} />;
    case 'lianjie':
      return <Lianjie key="7" {...rest} />;
    case 'shanchuxianstrikethrough2':
      return <Shanchuxianstrikethrough2 key="8" {...rest} />;
    case 'xieti':
      return <Xieti key="9" {...rest} />;
    case 'cuti':
      return <Cuti key="10" {...rest} />;
    case 'charulie_you':
      return <CharulieYou key="11" {...rest} />;
    case 'charulie_zuo':
      return <CharulieZuo key="12" {...rest} />;
    case 'charuhang_shang':
      return <CharuhangShang key="13" {...rest} />;
    case 'jinghao':
      return <Jinghao key="14" {...rest} />;
    case 'duiqifangshi_zuo':
      return <DuiqifangshiZuo key="15" {...rest} />;
    case 'duiqifangshi_you':
      return <DuiqifangshiYou key="16" {...rest} />;
    case 'fengexian':
      return <Fengexian key="17" {...rest} />;
    case 'duiqifangshi_zhong':
      return <DuiqifangshiZhong key="18" {...rest} />;
    case 'charuhang_xia':
      return <CharuhangXia key="19" {...rest} />;
    case 'shanchubiaoge':
      return <Shanchubiaoge key="20" {...rest} />;
    case 'wuxuliebiao':
      return <Wuxuliebiao key="21" {...rest} />;
    case 'shanchuhang':
      return <Shanchuhang key="22" {...rest} />;
    case 'shanchulie':
      return <Shanchulie key="23" {...rest} />;
    case 'hangneidaima':
      return <Hangneidaima key="24" {...rest} />;
    case 'youxuliebiao':
      return <Youxuliebiao key="25" {...rest} />;
    case 'yinyong':
      return <Yinyong key="26" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
