import assert from 'assert';
import sdk from 'wiznote-sdk-js';

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
}

class Api {
  constructor() {
    this._user = null;
  }

  isLoggedIn() {
    return this._user;
  }

  async localLogin() {
    assert(!this._user);
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

  get user() {
    return this._user;
  }

  get userGuid() {
    return this._user.userGuid;
  }

  get kbGuid() {
    return this._user.kbGuid;
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

  async syncData() {
    try {
      await this.refreshUserInfo();
      await this.syncKb(this.kbGuid, {
        noWait: true,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async refreshUserInfo() {
    sdk.refreshUserInfo(this.userGuid);
  }

  async syncKb(kbGuid, options) {
    sdk.syncKb(this.userGuid, kbGuid, options);
  }

  async getAllNotes(options) {
    const notes = await sdk.queryNotes(this.userGuid, this.kbGuid, 0, 10000, options);
    return notes;
  }

  async getAllTags(kbGuid) {
    const ret = await sdk.getAllTags(this.userGuid, kbGuid || this.kbGuid);
    return ret;
  }

  async hasNotesInTrash(kbGuid) {
    const ret = await sdk.hasNotesInTrash(this.userGuid, kbGuid || this.kbGuid);
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
}

const api = new Api();

export default api;
