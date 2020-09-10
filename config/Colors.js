import merge from 'lodash.merge';
import { Appearance } from 'react-native';
import { DynamicValue } from 'react-native-dynamic';
import { isTablet } from '../utils/device';

const light = {
  primary: '#448aff',
  bottomTabText: '#333333',
  topBarBackground: 'white',
  topBarTitle: '#333333',
  bottomTabBackground: 'white',
  closeDrawerButton: '#333333',
  loginBoxBackground: '#ffffff',
  loginBannerColor: '#ffffff',
  loginBoxText: '#333333',
  loginBoxText2: '#333333',
  loginBoxInputBackground: '#f0f0f0',
  loginBoxButtonBackground: '#333333',
  searchFieldBackground: '#eeeeee',
  searchField: '#333333',
  //
  phone: {
    noteListBackground: 'white',
    noteListSelectedBackground: 'white',
    noteListTitle: '#333333',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#d8d8d8',
    drawerItemTitle: '#333333',
    noteBackground: 'white',
    drawerBackground: '#f0f0f0',
    searchBarBackground: '#d8d8d8',
  },
  pad: {
    noteListBackground: '#f0f0f0',
    noteListSelectedBackground: 'white',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#d8d8d8',
    drawerItemTitle: '#333333',
    noteBackground: 'white',
    drawerBackground: '#d8d8d8',
    searchBarBackground: '#d8d8d8',
  },
};

const dark = merge({}, light, {
  primary: '#448aff',
  bottomTabText: '#d8d8d8',
  topBarTitle: '#d8d8d8',
  topBarBackground: '#2a2a2a',
  bottomTabBackground: '#2a2a2a',
  closeDrawerButton: '#f0f0f0',
  loginBoxBackground: '#606266',
  loginBannerColor: '#b4b7bb',
  loginBoxText: '#ffffff',
  loginBoxText2: '#aaaaaa',
  loginBoxInputBackground: '#53565c',
  loginBoxButtonBackground: '#000000',
  searchFieldBackground: '#333333',
  searchField: '#f0f0f0',

  phone: {
    noteListBackground: '#2a2a2a',
    noteListSelectedBackground: '#2a2a2a',
    noteListTitle: '#f0f0f0',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#404040',
    drawerItemTitle: '#f0f0f0',
    noteBackground: '#2a2a2a',
    drawerBackground: '#333333',
    searchBarBackground: '#404040',
  },
  pad: {
    noteListBackground: '#2a2a2a',
    noteListSelectedBackground: '#333333',
    noteListTitle: '#d8d8d8',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#404040',
    drawerItemTitle: '#d8d8d8',
    noteBackground: '#333333',
    drawerBackground: '#121212',
    searchBarBackground: '#404040',
  },
});

const Colors = {
  primary: light.primary,
  dark,
  light,
};

export default Colors;

export function getDynamicColor(name) {
  return new DynamicValue(Colors.light[name], Colors.dark[name]);
}

export function getDeviceDynamicColor(name) {
  const deviceName = isTablet ? 'pad' : 'phone';
  return new DynamicValue(Colors.light[deviceName][name], Colors.dark[deviceName][name]);
}

export function getColor(name) {
  const theme = Appearance.getColorScheme();
  return Colors[theme][name];
}

export function getDeviceColor(name) {
  const theme = Appearance.getColorScheme();
  const deviceName = isTablet ? 'pad' : 'phone';
  return Colors[theme][deviceName][name];
}

export function isDarkMode() {
  const theme = Appearance.getColorScheme();
  return theme === 'dark';
}
