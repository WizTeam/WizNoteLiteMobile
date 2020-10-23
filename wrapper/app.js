const assert = require('assert');
const rnfs = require('react-native-fs');
const { Platform } = require('react-native');
const path = require('path');

const RNFetchBlob = require('../thirdparty/react-native-fetch-blob').default;
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

async function doStandardPost(options) {
  //
  const headers = options.headers;
  //
  const data = [];
  for (const pair of options.data._parts) {
    const name = pair[0];
    const value = pair[1];
    //
    if (value.path && value.filename && value.type) {
      data.push({
        name,
        type: value.type,
        filename: value.filename,
        data: RNFetchBlob.wrap(value.path),
      });
    } else {
      data.push({
        name,
        data: value,
      });
    }
  }
  //
  const result = await RNFetchBlob.fetch('POST', options.url, headers, data);
  //
  result.status = result.respInfo.status;
  result.headers = result.respInfo.headers;
  //
  const responseContentType = result.headers['Content-Type'];
  if (responseContentType && responseContentType.startsWith('application/json')) {
    if (typeof result.data === 'string') {
      result.data = JSON.parse(result.data);
    }
  }
  //
  //
  return result;
}

const appName = pkg.productName;

function getLogFileName() {
  return path.join(rnfs.DocumentDirectoryPath, 'wiznote.txt');
}

function pathJoin(...paths) {
  return path.join(...paths);
}

export default {
  getVersion,
  getPath,
  getLocale,
  doStandardPost,
  name: appName,
  getLogFileName,
  pathJoin,
};
