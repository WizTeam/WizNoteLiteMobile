import React from 'react';
import { StatusBar } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';

const ThemedStatusBar: () => React$Node = () => {
  //
  const isDarkMode = useDarkMode();
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';
  //
  return (
    <StatusBar translucent barStyle={barStyle} />
  );
};

export default ThemedStatusBar;
