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
  drawerBackground: 'white',
  closeDrawerButton: '#333333',
  loginBoxBackground: '#ffffff',
  loginBoxText: '#333333',
  loginBoxText2: '#333333',
  loginBoxInputBackground: '#f0f0f0',
  loginBoxButtonBackground: '#333333',
  searchFieldBackground: '#eeeeee',
  searchField: '#333333',
  dropdownPickerBackground: '#ffffff',
  dropdownPickerItemColor: 'rgba(0,0,0,0.38)',
  dropdownPickerItemSelectedColor: 'rgba(0,0,0,0.87)',
  upgradeBackgroundColor: '#ffffff',
  upgradeBannerBackgroundColor: '#fafafa',
  upgradeText: '#333333',
  upgradeText2: '#aaaaaa',
  upgradeButtonBackground: '#333333',
  upgradeButtonColor: '#ffffff',
  //
  phone: {
    noteListBackground: 'white',
    noteListSelectedBackground: 'white',
    noteListTitle: '#333333',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#d8d8d8',
    drawerItemTitle: '#333333',
    noteBackground: 'white',
  },
  pad: {
    noteListBackground: '#f0f0f0',
    noteListSelectedBackground: 'white',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#d8d8d8',
    noteBackground: 'white',
  },
};

const dark = merge({}, light, {
  primary: '#448aff',
  bottomTabText: '#d8d8d8',
  topBarTitle: '#d8d8d8',
  topBarBackground: '#2a2a2a',
  bottomTabBackground: '#2a2a2a',
  drawerBackground: '#333333',
  closeDrawerButton: '#f0f0f0',
  loginBoxBackground: '#606266',
  loginBoxText: '#ffffff',
  loginBoxText2: '#aaaaaa',
  loginBoxInputBackground: '#53565c',
  loginBoxButtonBackground: '#000000',
  searchFieldBackground: '#333333',
  searchField: '#f0f0f0',
  dropdownPickerBackground: '#333333',
  dropdownPickerItemColor: 'rgba(255,255,255,0.38)',
  dropdownPickerItemSelectedColor: 'rgba(255,255,255,0.87)',
  upgradeBackgroundColor: '#2a2a2a',
  upgradeBannerBackgroundColor: '#2a2a2a',
  upgradeText: '#ffffff',
  upgradeText2: '#d8d8d8',
  upgradeButtonBackground: '#f0f0f0',
  upgradeButtonColor: '#333333',

  phone: {
    noteListBackground: '#2a2a2a',
    noteListSelectedBackground: '#2a2a2a',
    noteListTitle: '#f0f0f0',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#404040',
    drawerItemTitle: '#f0f0f0',
    noteBackground: '#282828',
  },
  pad: {
    noteListBackground: '#2a2a2a',
    noteListSelectedBackground: '#333333',
    noteListTitle: '#f0f0f0',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#404040',
    drawerItemTitle: '#f0f0f0',
    noteBackground: '#282828',
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
