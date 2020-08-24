import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
  <svg viewBox="0 0 375 812">
    <defs>
      <rect id="path-1" x="3.63797881e-12" y="0" width="375" height="812"></rect>
    </defs>
    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="登录">
        <g id="bg">
          <mask id="mask-2" fill="white">
            <use xlink:href="#path-1"></use>
          </mask>
          <use id="蒙版" fill="#D9E1E5" xlink:href="#path-1"></use>
          <rect fill="#EBF1F4" mask="url(#mask-2)" x="3.63797881e-12" y="0" width="375" height="385"></rect>
          <path d="M7.27595761e-12,326 C96,366 166.666667,372.666667 212,346 C257.333333,319.333333 311.666667,302 375,294 L375,585 L7.27595761e-12,585 L7.27595761e-12,326 Z" id="矩形" fill="#DEE7F0" mask="url(#mask-2)"></path>
          <path d="M112,616 C188.988545,621.499182 237.401472,690.09031 308,676 C334.845954,670.641987 357.084556,674.696422 375,680 C375,652 375,605 375,576 C313.029488,519.831073 210.779029,478.394832 146.429948,478.394832 C89.2316291,478.394832 35.9757038,428.585503 0,421 C0,447 0,601 0,633 C24.0396034,621.994689 59.6171367,612.258367 112,616 Z" id="椭圆形" fill="#C7CFD3" mask="url(#mask-2)"></path>
          <path d="M3.63797881e-12,0 L142.865079,0 C159.416336,-1.93382178e-07 175.798737,-3.32692391 191.038881,-9.78309403 C252.06306,-35.6347181 272.383432,-32.3736868 252,0 C218,54 105,84 3.63797881e-12,78 L3.63797881e-12,0 Z" id="矩形" fill="#DCE4E7" mask="url(#mask-2)"></path>
        </g>
      </g>
    </g>
  </svg>
`;

export default () => <SvgXml xml={xml} width="100%" height="100%" />;
