import assert from 'assert';
import sdk from 'wiznote-sdk-js';
import { EventEmitter } from 'events';

class SdkEventListener {
  static _listeners = new Map();

  constructor(userGuid, handler) {
    this._userGuid = userGuid;
    this._handler = handler;
    SdkEventListener._listeners.set(handler, this);
  }

  static fromHandler(handler) {
    return SdkEventListener._listeners.get(handler);
  }

  send(eventName, ...args) {
    this._handler(this._userGuid, eventName, ...args);
  }

  static sendToAll(eventName, ...args) {
    const handlers = SdkEventListener._listeners.keys();
    Array.from(handlers).forEach((handler) => {
      handler(eventName, ...args);
    });
  }
}

class Api extends EventEmitter {
  constructor() {
    super();
    sdk.i18nInit({});
    this._user = null;
  }

  isLoggedIn() {
    return this._user;
  }

  async localLogin() {
    assert(!this._user, 'user has already logged in');
    this._user = await sdk.localLogin();
    return this._user;
  }

  async onlineLogin(server, userId, password, options) {
    this._user = await sdk.onlineLogin(server, userId, password, options);
    return this._user;
  }

  async signUp(server, userId, password, options) {
    this._user = await sdk.signUp(server, userId, password, options);
    return this._user;
  }

  async logout() {
    sdk.logout(this.userGuid);
  }

  get user() {
    return this._user;
  }

  get userGuid() {
    if (!this._user) {
      console.error('fault error: this._user is null');
      console.error(new Error().stack);
      return null;
    }
    return this._user.userGuid;
  }

  get personalKbGuid() {
    return this._user.kbGuid;
  }

  get displayName() {
    return this._user.displayName;
  }

  get avatarUrl() {
    if (!this._user) {
      return null;
    }
    const version = this._user.avatarVersion;
    const userGuid = this.userGuid;
    const userData = sdk.getUserData(userGuid) ?? {};
    const as = userData.accountServer ?? {};
    const server = as.server;
    return `${server}/as/user/avatar/${userGuid}?version=${version}`;
  }

  get userToken() {
    return this._user.token;
  }

  get purchaseUrl() {
    if (!this._user) {
      return null;
    }
    const version = this._user.avatarVersion;
    const userGuid = this.userGuid;
    const userData = sdk.getUserData(userGuid) ?? {};
    const token = userData.token;
    const as = userData.accountServer ?? {};
    const apiServer = as.apiServer;
    return `${apiServer}/?p=wiz&c=vip_lite&token=${token}&clientType=lite_mobile&clientVersion=${version}`;
  }

  getUserData(userGuid) {
    return sdk.getUserData(userGuid);
  }

  initEvents() {
    this.registerListener(this.userGuid, (userGuid, eventName, ...args) => {
      this.emit(eventName, userGuid, ...args);
    });
  }

  registerListener(userGuid, callback) {
    const listener = new SdkEventListener(userGuid, callback);
    sdk.registerListener(userGuid, listener);
  }

  unregisterListener(callback) {
    const listener = SdkEventListener.fromHandler(callback);
    if (listener) {
      sdk.unregisterListener(listener);
    }
  }

  async syncData(kbGuid) {
    assert(kbGuid, 'kbGuid is empty - syncData');
    try {
      if (this._user.isLocalUser) {
        return;
      }
      //
      await this.refreshUserInfo();
      await this.syncKb(kbGuid, {
        noWait: true,
      });
    } catch (err) {
      SdkEventListener.sendToAll(this.userGuid, 'syncFinish', kbGuid, { error: err }, {});
    }
  }

  async refreshUserInfo() {
    const user = await sdk.refreshUserInfo(this.userGuid);
    return user;
  }

  async syncKb(kbGuid, options) {
    assert(kbGuid, 'kbGuid is empty - syncKb');
    await sdk.syncKb(this.userGuid, kbGuid, options);
  }

  async getAllNotes(kbGuid, options) {
    assert(kbGuid, 'kbGuid is empty - getAllNotes');
    const notes = await sdk.queryNotes(this.userGuid, kbGuid, 0, 10000, options);
    return notes;
  }

  async getNote(kbGuid, noteGuid) {
    assert(kbGuid, 'kbGuid is empty - getNote');
    const note = await sdk.getNote(this.userGuid, kbGuid, noteGuid);
    return note;
  }

  async getNoteMarkdown(kbGuid, noteGuid) {
    assert(kbGuid, 'kbGuid is empty - getNoteMarkdown');
    const markdown = await sdk.getNoteMarkdown(this.userGuid, kbGuid, noteGuid);
    return markdown;
  }

  async deleteNote(kbGuid, noteGuid) {
    assert(kbGuid, 'kbGuid is empty - deleteNote');
    await sdk.deleteNote(this.userGuid, kbGuid, noteGuid);
  }

  async putBackNote(kbGuid, noteGuid) {
    assert(kbGuid, 'kbGuid is empty - putBackNote');
    await sdk.putBackNote(this.userGuid, kbGuid, noteGuid);
  }

  async setNoteMarkdown(userGuid, kbGuid, noteGuid, markdown) {
    assert(kbGuid, 'userGuid is empty - setNoteMarkdown');
    assert(kbGuid, 'kbGuid is empty - setNoteMarkdown');
    await sdk.setNoteMarkdown(userGuid, kbGuid, noteGuid, markdown);
  }

  async setNoteStarred(kbGuid, noteGuid, starred) {
    assert(kbGuid, 'kbGuid is empty - setNoteStarred');
    await sdk.setNoteStarred(this.userGuid, kbGuid, noteGuid, starred);
  }

  async createNote(kbGuid, note = {}) {
    assert(kbGuid, 'kbGuid is empty - kbGuid');
    const newNote = await sdk.createNote(this.userGuid, kbGuid, note);
    return newNote;
  }

  async addImageFromUrl(kbGuid, noteGuid, url, options = {}) {
    assert(kbGuid, 'kbGuid is empty - addImageFromUrl');
    const result = await sdk.addImageFromUrl(
      this.userGuid, kbGuid, noteGuid, url, options,
    );
    return result;
  }

  async addImageFromData(kbGuid, noteGuid, data, options = {}) {
    assert(kbGuid, 'kbGuid is empty - addImageFromData');
    const result = await sdk.addImageFromData(
      this.userGuid, kbGuid, noteGuid, data, options,
    );
    return result;
  }

  async getAllTags(kbGuid) {
    assert(kbGuid, 'kbGuid is empty - getAllTags');
    const ret = await sdk.getAllTags(this.userGuid, kbGuid);
    return ret;
  }

  async hasNotesInTrash(kbGuid) {
    assert(kbGuid, 'kbGuid is empty - hasNotesInTrash');
    const ret = await sdk.hasNotesInTrash(this.userGuid, kbGuid);
    return ret;
  }

  getSettings(key, defaultValue) {
    return sdk.getSettings(key, defaultValue);
  }

  setSettings(key, value) {
    sdk.setSettings(key, value);
  }

  getUserSettings(userGuid, key, defaultValue) {
    return sdk.getUserSettings(userGuid, key, defaultValue);
  }

  setUserSettings(userGuid, key, value) {
    return sdk.setUserSettings(userGuid, key, value);
  }

  async searchNotes(kbGuid, key) {
    assert(kbGuid, 'kbGuid is empty - searchNotes');
    const options = {
      searchText: key,
    };
    const notes = await sdk.queryNotes(this.userGuid, kbGuid, 0, 10000, options);
    return notes;
  }

  async searchNotesForTitle(kbGuid, title) {
    const notes = await sdk.queryNotes(
      this.userGuid,
      kbGuid,
      0,
      10000,
      { title, analysisTags: true },
    );
    return notes;
  }

  async searchAllNotesTitle(kbGuid) {
    const titles = await sdk.getAllTitles(this.userGuid, kbGuid);
    return titles;
  }

  async getBackwardLinkedNotes(kbGuid, title) {
    const res = await sdk.getBackwardLinkedNotes(this.userGuid, kbGuid, title);
    return res;
  }

  updateUserDisplayName(displayName) {
    const userData = sdk.getUserData(this.userGuid) ?? {};
    const server = userData.accountServer.server;

    return this.core.request.standardRequest({
      url: `${server}/as/users/update_info`,
      token: this.userToken,
      data: {
        displayName,
      },
      method: 'PUT',
    });
  }

  async changeAccount(password, userId, newUserId) {
    const userData = sdk.getUserData(this.userGuid) ?? {};
    const server = userData.accountServer.server;

    return this.core.request.standardRequest({
      url: `${server}/as/users/change_account`,
      token: this.userToken,
      data: {
        userId,
        newUserId,
        password,
      },
      method: 'POST',
    });
  }

  async changePassword(newPwd, oldPwd) {
    const userData = sdk.getUserData(this.userGuid) ?? {};
    const server = userData.accountServer.server;

    return this.core.request.standardRequest({
      url: `${server}/as/users/change_pwd`,
      token: this.userToken,
      data: {
        newPwd,
        oldPwd,
      },
      method: 'POST',
    });
  }

  get core() {
    return sdk.core;
  }
}

const api = new Api();

export default api;
