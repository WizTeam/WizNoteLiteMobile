const SyncStorage = require('sync-storage').default;

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
    console.log(`set ${key}=${value}`);
    SyncStorage.set(this._getKey(key), value);
  }

  get(key) {
    const value = SyncStorage.get(this._getKey(key));
    console.log(`get ${key}=${value}`);
    return value;
  }

  delete(key) {
    console.log(`delete ${key}`);
    SyncStorage.remove(this._getKey(key));
  }
}

export default Store;
