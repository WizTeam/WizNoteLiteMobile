const rnfs = require('react-native-fs');
const path = require('path');

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
  console.log(subList);
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

const fs = {};

fs.ensureDir = ensureDir;
fs.copy = copy;
fs.copyFile = copyFile;
fs.readFile = rnfs.readFile;
fs.writeFile = rnfs.writeFile;
fs.pathExists = rnfs.pathExists;
fs.readdir = rnfs.readdir;
fs.stat = rnfs.stat;
fs.exists = rnfs.exists;

export default fs;
