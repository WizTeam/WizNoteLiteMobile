import merge from 'lodash.merge';
import { Appearance } from 'react-native';
import { DynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { isTablet, trackDeviceTypeChange } from '../utils/device';

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
  dropdownPickerBackground: '#ffffff',
  dropdownPickerItemColor: 'rgba(0,0,0,0.38)',
  dropdownPickerItemSelectedColor: 'rgba(0,0,0,0.87)',
  upgradeBackgroundColor: '#ffffff',
  upgradeBannerBackgroundColor: '#fafafa',
  upgradeText: '#333333',
  upgradeText2: '#aaaaaa',
  upgradeButtonBackground: '#333333',
  upgradeButtonColor: '#ffffff',
  toolbarBackground: '#d7d8da',
  toolbarIconColor: '#333333',
  toolbarActiveIconColor: '#006eff',
  tabBtnBackground: '#fff',
  tabBtnActiveBackground: '#333',
  tabBtnColor: 'rgba(68, 138, 255, 0.9)',
  linkSubtitleColor: '#666',
  settingBackgroundColor: '#f2f2f7',
  settingTitleColor: '#333',
  settingFontColor: '#666',
  settingMainColor: '#4089d6',
  //
  phone: {
    rootBackground: 'white',
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
    rootBackground: '#f0f0f0',
    noteListBackground: '#f0f0f0',
    noteListSelectedBackground: 'white',
    noteListSubTitle: '#aaaaaa',
    noteListDivider: '#d8d8d8',
    drawerItemTitle: '#333333',
    noteBackground: 'white',
    drawerBackground: '#d8d8d8',
    searchBarBackground: '#d8d8d8',
  },
  theme: {
    default: {
      primary: '#ffffff',
    },
    beiges: {
      primary: '#fff9e2',
    },
    mintGreen: {
      primary: '#eae9e5',
    },
    coffee: {
      primary: '#ffffff',
    },
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
  dropdownPickerBackground: '#555555',
  dropdownPickerItemColor: 'rgba(255,255,255,0.38)',
  dropdownPickerItemSelectedColor: 'rgba(255,255,255,0.87)',
  upgradeBackgroundColor: '#2a2a2a',
  upgradeBannerBackgroundColor: '#2a2a2a',
  upgradeText: '#ffffff',
  upgradeText2: '#d8d8d8',
  upgradeButtonBackground: '#f0f0f0',
  upgradeButtonColor: '#333333',
  toolbarBackground: '#121212',
  toolbarIconColor: '#f0f0f0',
  tabBtnBackground: '#ddd',
  tabBtnActiveBackground: '#f0f0f0',
  tabBtnColor: 'rgba(68, 138, 255, 0.9)',
  settingBackgroundColor: '#53565c',
  linkSubtitleColor: '#aaaaaa',
  settingTitleColor: '#fff',
  settingFontColor: '#aaa',

  phone: {
    rootBackground: '#2a2a2a',
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
    rootBackground: '#2a2a2a',
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
  theme: {
    default: {
      primary: '#333333',
    },
    beiges: {
      primary: '#6d6b65',
    },
    mintGreen: {
      primary: '#5b6b6a',
    },
    coffee: {
      primary: '#494949',
    },
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
  const deviceName = isTablet() ? 'pad' : 'phone';
  return new DynamicValue(Colors.light[deviceName][name], Colors.dark[deviceName][name]);
}

export function getColor(name) {
  const theme = Appearance.getColorScheme();
  return Colors[theme][name];
}

export function getDeviceColor(name) {
  const theme = Appearance.getColorScheme();
  const deviceName = isTablet() ? 'pad' : 'phone';
  return Colors[theme][deviceName][name];
}

export function getThemeColor(name) {
  const theme = Appearance.getColorScheme();
  return Colors[theme].theme[name];
}

export function isDarkMode() {
  const theme = Appearance.getColorScheme();
  return theme === 'dark';
}

const deviceDynamicStyles = [];

export function createDeviceDynamicStyles(styleCreator) {
  const styleOptions = styleCreator();
  const dynamicStyle = new DynamicStyleSheet(styleOptions);
  const result = {
    creator: styleCreator,
    styles: dynamicStyle,
  };
  deviceDynamicStyles.push(result);
  return result;
}

trackDeviceTypeChange(() => {
  deviceDynamicStyles.forEach((elem) => {
    const styleCreator = elem.creator;
    const styleOptions = styleCreator();
    const dynamicStyle = new DynamicStyleSheet(styleOptions);
    // eslint-disable-next-line no-param-reassign
    elem.styles = dynamicStyle;
  });
});
