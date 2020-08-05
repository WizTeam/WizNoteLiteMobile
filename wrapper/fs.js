const rnfs = require('react-native-fs');
const path = require('path');
const assert = require('assert');

async function ensureDir(pth) {
  try {
    await rnfs.mkdir(pth, options.mode)
  } catch (error) {
    if (error.code === 'EPERM') {
      throw error
    }

    if (error.code === 'ENOENT') {
      if (path.dirname(pth) === pth) {
        throw err;
      }

      if (error.message.includes('null bytes')) {
        throw error
      }

      await ensureDir(path.dirname(pth))
      return ensureDir(pth)
    }

    try {
      const stats = await fs.stat(pth)
      if (!stats.isDirectory()) {
        // This error is never exposed to the user
        // it is caught below, and the original error is thrown
        throw new Error('The path is not a directory')
      }
    } catch {
      throw error
    }
  }
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
