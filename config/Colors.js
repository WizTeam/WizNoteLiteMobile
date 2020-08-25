import merge from 'lodash.merge';
import { Appearance } from 'react-native';
import { DynamicValue } from 'react-native-dynamic';
import { isTablet } from '../utils/device';

const light = {
  primary: '#448aff',
  bottomTabText: '#333333',
  topBarBackground: '#2a2a2a',
  topBarTitle: '#2a2a2a',
  bottomTabBackground: '#2a2a2a',
  drawerBackground: 'white',
  closeDrawerButton: 'rgb(51, 51, 51)',
  loginBoxBackground: '#ffffff',
  loginBoxText: '#333333',
  loginBoxText2: '#333333',
  loginBoxInputBackground: '#f0f0f0',
  loginBoxButtonBackground: '#333333',
  //
  phone: {
    noteListBackground: 'white',
    noteListSelectedBackground: 'white',
    noteListTitle: 'rgb(51, 51, 51)',
    noteListSubTitle: 'rgb(170, 170, 170)',
    noteListDivider: '#d8d8d8',
    drawerItemTitle: 'rgb(51, 51, 51)',
  },
  pad: {
    noteListBackground: 'rgb(240, 240, 240)',
    noteListSelectedBackground: 'white',
    noteListSubTitle: 'rgb(170, 170, 170)',
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
  closeDrawerButton: 'rgb(240, 240, 240)',
  loginBoxBackground: '#606266',
  loginBoxText: '#ffffff',
  loginBoxText2: '#aaaaaa',
  loginBoxInputBackground: '#53565c',
  loginBoxButtonBackground: '#000000',

  phone: {
    noteListBackground: '#2a2a2a',
    noteListSelectedBackground: '#2a2a2a',
    noteListTitle: 'rgb(240, 240, 240)',
    noteListSubTitle: 'rgb(170, 170, 170)',
    noteListDivider: 'rgb(64, 64, 64)',
    drawerItemTitle: 'rgb(240, 240, 240)',
  },
  pad: {
    noteListBackground: '#2a2a2a',
    noteListSelectedBackground: 'rgb(51, 51, 51)',
    noteListTitle: 'rgb(240, 240, 240)',
    noteListSubTitle: 'rgb(170, 170, 170)',
    noteListDivider: 'rgb(64, 64, 64)',
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
