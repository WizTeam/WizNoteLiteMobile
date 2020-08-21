import RNFetchBlob from '../thirdparty/react-native-fetch-blob';

const rnfs = require('react-native-fs');
const path = require('path');
const base64 = require('base64-js');

function binaryToBase64(data) {
  if (data instanceof ArrayBuffer) {
    // eslint-disable-next-line no-param-reassign
    data = new Uint8Array(data);
  }
  if (data instanceof Uint8Array) {
    return base64.fromByteArray(data);
  }
  if (!ArrayBuffer.isView(data)) {
    throw new Error('data must be ArrayBuffer or typed array');
  }
  const { buffer, byteOffset, byteLength } = data;
  return base64.fromByteArray(new Uint8Array(buffer, byteOffset, byteLength));
}

async function ensureDir(pth, options) {
  // console.log(`ensure dir: ${pth}`);
  await rnfs.mkdir(pth, options);
}

async function copyFile(src, dest) {
  // console.log(`copy file: ${src}, ${dest}`);
  if (await rnfs.exists(dest)) {
    await rnfs.unlink(dest);
  }
  //
  await rnfs.copyFile(src, dest);
}

async function copy(src, dest, options) {
  const statResult = await rnfs.stat(src);
  if (statResult.isDirectory()) {
    await copyFile(src, dest);
  }
  //
  const subList = await rnfs.readDir(src);
  for (const sub of subList) {
    const subSrc = path.join(src, sub.name);
    const subDest = path.join(dest, sub.name);
    if (sub.isDirectory()) {
      await ensureDir(subDest);
      await copy(subSrc, subDest, options);
    } else {
      await copyFile(subSrc, subDest);
    }
  }
}
async function writeFile(filePath, data, options) {
  if (data.constructor === ArrayBuffer) {
    const base64Data = binaryToBase64(data);
    await RNFetchBlob.fs.createFile(filePath, base64Data, 'base64');
    return 0;
  }
  //
  const ret = await rnfs.writeFile(filePath, data, options);
  return ret;
}

const fs = {};

fs.ensureDir = ensureDir;
fs.copy = copy;
fs.copyFile = copyFile;
fs.writeFile = writeFile;
fs.readFile = rnfs.readFile;
fs.pathExists = rnfs.pathExists;
fs.readdir = rnfs.readdir;
fs.stat = rnfs.stat;
fs.exists = rnfs.exists;

export default fs;
