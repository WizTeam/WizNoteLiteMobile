const SQLite = require('../thirdparty/react-native-sqlite-storage/sqlite');

class Database {
  constructor(path, callback) {
    this._db = SQLite.openDatabase(path, () => {
      callback(null);
    }, (err) => {
      callback(err);
    });
  }

  run(sql, values, callback) {
    this._db.executeSql(sql, values)
    .then((tx, result) => callback(null, result))
    .catch((err) => callback(err));
  }

  all(sql, values, callback) {
    return this.run(sql, values, callback);
  }

  close(callback) {
    db.close().then((status) => {
      callback();
    }).catch((err) => {
      callback(err);
    });
  }
}

export default {
  Database,
};
