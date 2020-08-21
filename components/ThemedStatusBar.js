import React from 'react';
import { StatusBar } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import ThemeListener from './ThemeListener';

const ThemedStatusBar: () => React$Node = (props) => {
  //
  const isDarkMode = useDarkMode();
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';
  //
  return (
    <>
      <ThemeListener onThemeChanged={props.onThemeChanged} />
      <StatusBar translucent barStyle={barStyle} />
    </>
  );
};

export default ThemedStatusBar;
