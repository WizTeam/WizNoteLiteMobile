import React, {
  PixelRatio,
  Platform,
  Dimensions,
} from 'react-native';

const windowSize = Dimensions.get('window');

const pixelDensity = PixelRatio.get();
const width = windowSize.width;
const height = windowSize.height;
const adjustedWidth = width * pixelDensity;
const adjustedHeight = height * pixelDensity;
const isTablet = Math.min(width, height) > 600;
const isPhone = !isTablet;
const isIos = Platform.OS === 'ios';
const isAndroid = !isIos;

export {
  pixelDensity,
  width,
  height,
  adjustedHeight,
  adjustedWidth,
  isTablet,
  isPhone,
  isIos,
  isAndroid,
};
