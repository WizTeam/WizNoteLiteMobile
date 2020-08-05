const SyncStorage = require('sync-storage');

class Store {
  constructor(prefix) {
    this._prefix = prefix;
  }

  _getKey(key) {
    if (!this._prefix) {
      return key;
    }
    return `${this._prefix}/${key}`;
  }

  set(key, value) {
    SyncStorage.set(this._getKey(key), value);
  }

  get(key) {
    SyncStorage.get(this._getKey(key));
  }
}

module.exports = Store;