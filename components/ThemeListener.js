import React, { useRef } from 'react';
import { Appearance } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { Navigation } from 'react-native-navigation';
import Colors from '../config/Colors';

function getNavigationOptions(isDarkMode) {
  if (isDarkMode === undefined) {
    // eslint-disable-next-line no-param-reassign
    isDarkMode = Appearance.getColorScheme() === 'dark';
  }
  const colors = Colors[isDarkMode ? 'dark' : 'light'];
  //
  return {
    topBar: {
      leftButtonColor: colors.topBarTitle,
      background: {
        color: colors.topBarBackground,
      },
      largeTitle: {
        color: colors.topBarTitle,
      },
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
      backgroundColor: colors.bottomTabBackground,
    },
    bottomTab: {
      textColor: colors.bottomTabText,
      iconColor: colors.bottomTabText,
      selectedIconColor: colors.primary,
      selectedTextColor: colors.primary,
    },
  };
}

export function setDefaultNavigationOptions(isDarkMode) {
  Navigation.setDefaultOptions(getNavigationOptions(isDarkMode));
}

export function updateNavigationTheme(componentId, themeName) {
  console.log(`switch bottom tab theme to: ${themeName}`);
  Navigation.mergeOptions(componentId, getNavigationOptions(themeName === 'dark'));
}

const ThemeListener: () => React$Node = (props) => {
  const currentThemeRef = useRef(null);
  const isDarkMode = useDarkMode();
  if (currentThemeRef.current === null || currentThemeRef.current !== isDarkMode) {
    const themeName = isDarkMode ? 'dark' : 'light';
    if (currentThemeRef.current) {
      console.log(`init theme: ${themeName}`);
    } else {
      console.log(`switch theme to: ${themeName}`);
    }
    currentThemeRef.current = isDarkMode;
    setDefaultNavigationOptions(isDarkMode);
    if (props.onThemeChanged) {
      props.onThemeChanged(themeName);
    }
  }
  return (<></>);
};

export default ThemeListener;
