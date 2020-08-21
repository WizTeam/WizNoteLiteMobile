import React, { useRef } from 'react';
import { Appearance } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { Navigation } from 'react-native-navigation';
import Colors from '../config/Colors';

export function setDefaultNavigationOptions(isDarkMode) {
  //
  if (isDarkMode === undefined) {
    // eslint-disable-next-line no-param-reassign
    isDarkMode = Appearance.getColorScheme() === 'dark';
  }
  //
  const colors = Colors[isDarkMode ? 'dark' : 'light'];
  //
  Navigation.setDefaultOptions({
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
    },
    bottomTab: {
      textColor: colors.bottomTabText,
      iconColor: colors.bottomTabText,
      selectedIconColor: colors.primary,
      selectedTextColor: colors.primary,
    },
  });
}

export function updateBottomTabButton(componentId, themeName) {
  const colors = Colors[themeName];
  Navigation.mergeOptions(componentId, {
    bottomTab: {
      textColor: colors.bottomTabText,
      iconColor: colors.bottomTabText,
      selectedIconColor: colors.primary,
      selectedTextColor: colors.primary,
    },
  });
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
