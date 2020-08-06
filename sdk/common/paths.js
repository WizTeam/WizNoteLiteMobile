const path = require('path');

const wrapper = global.wizWrapper;
const app = wrapper.app;

function getResourcesPath() {
  const resourcePath = app.getPath('res');
  return resourcePath;
}

function getAppData() {
  return path.join(app.getPath('appData'), app.name);
}

function getUsersData() {
  const p = path.join(getAppData(), 'users');
  return p;
}

function getUserData(userGuid) {
  const p = path.join(getUsersData(), userGuid);
  return p;
}

function getNoteData(userGuid, kbGuid, noteGuid) {
  const p = path.join(getUserData(userGuid), kbGuid, noteGuid);
  return p;
}

function getNoteResources(userGuid, kbGuid, noteGuid) {
  const p = path.join(getNoteData(userGuid, kbGuid, noteGuid), 'index_files');
  return p;
}

function getTempPath() {
  const base = app.getPath('temp');
  const rand = new Date().valueOf();
  const newTemp = path.join(base, `${rand}`);
  // TODO: check getTempPath
  // fs.ensureDirSync(newTemp);
  return newTemp;
}

module.exports = {
  getAppData,
  getUsersData,
  getUserData,
  getNoteData,
  getNoteResources,
  getTempPath,
  getResourcesPath,
};
