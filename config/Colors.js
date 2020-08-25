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
  //
  phone: {
    noteListBackground: 'white',
    noteListSelectedBackground: 'white',
    noteListTitle: '#333333',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#d8d8d8',
    drawerItemTitle: '#333333',
  },
  pad: {
    noteListBackground: '#f0f0f0',
    noteListSelectedBackground: 'white',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#d8d8d8',
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

  phone: {
    noteListBackground: '#2a2a2a',
    noteListSelectedBackground: '#2a2a2a',
    noteListTitle: '#f0f0f0',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#404040',
    drawerItemTitle: '#f0f0f0',
  },
  pad: {
    noteListBackground: '#2a2a2a',
    noteListSelectedBackground: '#333333',
    noteListTitle: '#f0f0f0',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#404040',
  },
});

const Colors = {
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
