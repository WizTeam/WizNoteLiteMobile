const rnfs = require('react-native-fs');
const path = require('path');
const assert = require('assert');

async function ensureDir(pth, options) {
  await rnfs.mkdir(pth, options);
}

async function pathExists(p) {
  const exists = await rnfs.exists(p);
  if (!exists) {
    return false;
  }
  //
  const statResult = await rnfs.stat(p);
  return statResult.isDirectory();
}

rnfs.ensureDir = ensureDir;
rnfs.pathExists = pathExists;

assert(rnfs.readFile);
assert(rnfs.writeFile);
assert(rnfs.ensureDir);
assert(rnfs.pathExists);
assert(rnfs.readdir);
assert(rnfs.stat);
assert(rnfs.copyFile);
assert(rnfs.exists);

module.exports = rnfs;
