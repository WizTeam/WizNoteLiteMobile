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

  get kbGuid() {
    return this._user.kbGuid;
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

  async syncData() {
    try {
      if (this._user.isLocalUser) {
        return;
      }
      //
      await this.refreshUserInfo();
      await this.syncKb(this.kbGuid, {
        noWait: true,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async refreshUserInfo() {
    await sdk.refreshUserInfo(this.userGuid);
  }

  async syncKb(kbGuid, options) {
    await sdk.syncKb(this.userGuid, kbGuid || this.kbGuid, options);
  }

  async getAllNotes(kbGuid, options) {
    const notes = await sdk.queryNotes(this.userGuid, kbGuid || this.kbGuid, 0, 10000, options);
    return notes;
  }

  async getNote(kbGuid, noteGuid) {
    const note = await sdk.getNote(this.userGuid, kbGuid || this.kbGuid, noteGuid);
    return note;
  }

  async getNoteMarkdown(kbGuid, noteGuid) {
    const markdown = await sdk.getNoteMarkdown(this.userGuid, kbGuid || this.kbGuid, noteGuid);
    return markdown;
  }

  async deleteNote(kbGuid, noteGuid) {
    await sdk.deleteNote(this.userGuid, kbGuid || this.kbGuid, noteGuid);
  }

  async putBackNote(kbGuid, noteGuid) {
    await sdk.putBackNote(this.userGuid, kbGuid || this.kbGuid, noteGuid);
  }

  async setNoteMarkdown(userGuid, kbGuid, noteGuid, markdown) {
    await sdk.setNoteMarkdown(userGuid || this.userGuid, kbGuid || this.kbGuid, noteGuid, markdown);
  }

  async setNoteStarred(kbGuid, noteGuid, starred) {
    await sdk.setNoteStarred(this.userGuid, kbGuid || this.kbGuid, noteGuid, starred);
  }

  async createNote(kbGuid, note = {}) {
    const newNote = await sdk.createNote(this.userGuid, kbGuid || this.kbGuid, note);
    return newNote;
  }

  async addImageFromUrl(kbGuid, noteGuid, url, options = {}) {
    const result = await sdk.addImageFromUrl(
      this.userGuid, kbGuid || this.kbGuid, noteGuid, url, options,
    );
    return result;
  }

  async addImageFromData(kbGuid, noteGuid, data, options = {}) {
    const result = await sdk.addImageFromData(
      this.userGuid, kbGuid || this.kbGuid, noteGuid, data, options,
    );
    return result;
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

  async searchNotes(kbGuid, key) {
    const options = {
      searchText: key,
    };
    const notes = await sdk.queryNotes(this.userGuid, kbGuid || this.kbGuid, 0, 10000, options);
    return notes;
  }
}

const api = new Api();

export default api;
