const assert = require('assert');
const rnfs = require('react-native-fs');
const { Platform } = require('react-native');
const path = require('path');

const pkg = require('../package.json');

function getVersion() {
  return pkg.version;
}

Platform.select({
  ios: () => {},
  android: () => { rnfs.MainBundlePath = path.join(rnfs.DocumentDirectoryPath, 'resources'); },
})();

function getPath(name) {
  if (name === 'appData') {
    return rnfs.DocumentDirectoryPath;
  } else if (name === 'temp') {
    return rnfs.TemporaryDirectoryPath;
  } else if (name === 'res') {
    return rnfs.MainBundlePath;
  }

  assert(false, `unknown path name: ${name}`);
  return '';
}

function getLocale() {
  return 'en';
}

const appName = pkg.productName;

export default {
  getVersion,
  getPath,
  getLocale,
  name: appName,
};
