const path = require('path');
import { Platform } from 'react-native';
const rnfs = require('react-native-fs');
const SQLite = require('../thirdparty/react-native-sqlite-storage/sqlite');

class Database {
  constructor(dbPath, callback) {
    if (Platform.OS === 'ios') {
      const documentsPath = rnfs.DocumentDirectoryPath;
      if (dbPath.startsWith(documentsPath)) {
        dbPath = dbPath.substr(documentsPath.length);
      }
    }
    const name = dbPath;
    this._db = SQLite.openDatabase({ name, location: 'Documents' }, () => {
      callback(null);
    }, (err) => {
      callback(err);
    });
  }

  run(sql, values, callback) {
    //
    if (values) {
      values = values.map((value) => {
        if (value instanceof Date) {
          return value.valueOf();
        }
        return value;
      });
    }
    this._db.executeSql(sql, values, (results) => {
      callback(null, results);
    }, (err) => {
      console.error(err);
      callback(err);
    });
  }

  all(sql, values, callback) {
    return this.run(sql, values, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results.rows);
      }
    });
  }

  close(callback) {
    db.close(() => {
      callback
    }, callback);
  }
}

export default {
  Database,
};
