import {
  Platform,
  Dimensions,
} from 'react-native';
import { EventEmitter } from 'events';

const deviceEventObject = new EventEmitter();

export function trackDeviceTypeChange(listener) {
  deviceEventObject.addListener('deviceTypeChanged', listener);
}

export function reportDeviceTypeChanged(deviceIsTablet) {
  deviceEventObject.emit('deviceTypeChanged', deviceIsTablet);
}

const windowSize = Dimensions.get('window');

function detectIsTablet(width, height) {
  const tablet = Math.min(width, height) > 600;
  return tablet;
}

let windowWidth = windowSize.width;
let windowHeight = windowSize.height;
const isIos = Platform.OS === 'ios';
const isAndroid = !isIos;

export function updateDeviceType(width, height) {
  windowWidth = width;
  windowHeight = height;
  return detectIsTablet(width, height);
}
export function isTablet() {
  return detectIsTablet(windowWidth, windowHeight);
}
export function isPhone() {
  return !isTablet();
}

export {
  isIos,
  isAndroid,
};
