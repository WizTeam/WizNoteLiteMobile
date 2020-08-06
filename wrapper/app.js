const assert = require('assert');
const rnfs = require('react-native-fs');
const pkg = require('../package.json');

function getVersion() {
  return pkg.version;
}

function getPath(name) {
  if (name === 'appData') {
    return rnfs.DocumentDirectoryPath;
  } else if (name === 'temp') {
    return rnfs.TemporaryDirectoryPath;
  } else if (name === 'res') {
    return rnfs.MainBundlePath;
  } else {
    assert(false, `unknown path name: ${name}`);
  }
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
