const assert = require('assert');
const users = require('./user/users');

assert(global.wizWrapper, 'wizWrapper must be initialized before using wiznote sdk');

async function getLink(userGuid, name) {
  const link = await users.getLink(userGuid, name);
  return link;
}

async function signUp(server, userId, password, options = {}) {
  const user = await users.signUp(server, userId, password, options);
  return user;
}

async function onlineLogin(server, userId, password, options = {}){
  const user = await users.onlineLogin(server, userId, password, options);
  return user;
}

async function localLogin() {
  const user = await users.localLogin();
  return user;
}

async function logout(userGuid) {
  await users.logout(userGuid);
}

async function queryNotes(userGuid, kbGuid, start, count, options = {}) {
  const notes = await users.queryNotes(userGuid, kbGuid, start, count, options);
  return notes;
}

async function getNote(userGuid, kbGuid, noteGuid, options) {
  const result = await users.getNote(userGuid, kbGuid, noteGuid, options);
  return result;
}

async function getNoteMarkdown(userGuid, kbGuid, noteGuid) {
  const result = await users.getNoteMarkdown(userGuid, kbGuid, noteGuid);
  return result;
}

async function setNoteMarkdown(userGuid, kbGuid, noteGuid, markdown) {
  const result = await users.setNoteMarkdown(userGuid, kbGuid, noteGuid, markdown);
  return result;
}

async function createNote(userGuid, kbGuid, note) {
  const result = await users.createNote(userGuid, kbGuid, note);
  return result;
}

async function deleteNote(userGuid, kbGuid, noteGuid) {
  const result = await users.deleteNote(userGuid, kbGuid, noteGuid);
  return result;
}

async function putBackNote(userGuid, kbGuid, noteGuid) {
  const result = await users.putBackNote(userGuid, kbGuid, noteGuid);
  return result;
}

async function syncKb(userGuid, kbGuid, options) {
  const result = await users.syncKb(userGuid, kbGuid, options);
  return result;
}

// async function addImagesFromLocal(...args) {
//   const webContents = event.sender;
//   const browserWindow = BrowserWindow.fromWebContents(webContents);
//   const result = await users.addImagesFromLocal(browserWindow, ...args);
//   return result;
// }

async function addImageFromData(userGuid, kbGuid, noteGuid, data, options) {
  const result = await users.addImageFromData(userGuid, kbGuid, noteGuid, data, options);
  return result;
}


async function addImageFromUrl(userGuid, kbGuid, noteGuid, url, options) {
  const result = await users.addImageFromUrl(userGuid, kbGuid, noteGuid, url, options);
  return result;
}

async function getSettings( key, defaultValue) {
  return globalSettings.getSettings(key, defaultValue);
}

async function setSettings( key, value) {
  globalSettings.setSettings(key, value);
}

async function getUserSettings( userGuid, key, defaultValue) {
  return users.getSettings(userGuid, key, defaultValue);
}

async function setUserSettings( userGuid, key, value) {
  users.setSettings(userGuid, key, value);
}

async function getAllTags(userGuid, kbGuid) {
  const result = await users.getAllTags(userGuid, kbGuid);
  return result;
}

async function getAllLinks(userGuid, kbGuid) {
  const result = await users.getAllLinks(userGuid, kbGuid);
  return result;
}

async function renameTag(userGuid, kbGuid, from, to) {
  const result = await users.renameTag(userGuid, kbGuid, from, to);
  return result;
}

async function setNoteStarred(userGuid, kbGuid, noteGuid, starred) {
  const result = await users.setNoteStarred(userGuid, kbGuid, noteGuid, starred);
  return result;
}

async function hasNotesInTrash(userGuid, kbGuid) {
  const result = await users.hasNotesInTrash(userGuid, kbGuid);
  return result;
}

async function getUserInfo(userGuid) {
  const user = users.getUserInfo(userGuid);
  return user;
}


async function refreshUserInfo(userGuid) {
  const user = await users.refreshUserInfo(userGuid);
  return user;
}


(async () => {
  try {
    const allUsers = await users.getUsers()
    console.log(allUsers);
    //
    let user = await localLogin();
    if (!user) {
      console.log('failed to localLogin, do online login');
      //
      user = await users.onlineLogin('as.wiz.cn', 'test_node@wiz.cn', '123456');
      //
    } else {
      console.log('localLogin done');
      console.log(user);
    }
    //
  } catch (err) {
    console.error(err);
  }

})();

const wizApi = {

}

module.exports = wizApi;
