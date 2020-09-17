import React from 'react';
import { WebView } from 'react-native-webview';

const ForgotWebView: () => React$Node = () => {
  const uri = 'https://api.wiz.cn/?p=wiz&v=7.7.6&c=forgot_password&plat=ios&debug=false&l=zh-cn&cn=';
  //
  return (
    <WebView
      source={{ uri }}
    />
  );
};

export default ForgotWebView;
