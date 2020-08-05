const assert = require('assert');
const AwaitLock = require('../common/await_lock');
const { WizInternalError } = require('../share/error');
const updateDb = require('./update_db');
//
const { sqlite3, fs } = global.wizWrapper;

class SqliteDb {
  constructor(dbPath) {
    this._dbPath = dbPath;
    this._locker = null;
  }

  //
  async _lock() {
    if (!this._locker) {
      this._locker = new AwaitLock();
    }
    await this._locker.acquireAsync();
    // console.log('locked');
  }

  //
  _unlock() {
    assert(this._locker, 'locker must be exists before unlock');
    this._locker.release();
    // console.log('unlocked');
  }

  //
  _open() {
    return new Promise((resolve, reject) => {
      this._db = new sqlite3.Database(this._dbPath, async (err) => {
        if (err) {
          reject(err);
        } else {
          // check file size
          try {
            const exists = await fs.exists(this._dbPath);
            if (exists) {
              const statResult = await fs.stat(this._dbPath);
              const fileSize = statResult.size;
              if (fileSize > 100 * 1024 * 1024) {
                // fileSize > 100M
                console.warn(`warn: ${this._dbPath} is too large: ${fileSize}`);
              }
            }
          } catch (e) {
            console.error(e);
          }
          //
          resolve();
        }
      });
    });
  }

  //
  _run(sql, values) {
    return new Promise((resolve, reject) => {
      this._db.run(sql, values || [],  (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  //
  _all(sql, values) {
    return new Promise((resolve, reject) => {
      this._db.all(sql, values || [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  //
  _close() {
    return new Promise((resolve, reject) => {
      this._db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  //
  _assertOpen() {
    if (this._db) {
      return;
    }
    //
    const now = new Date().valueOf();
    //
    if (!this._openTime) {
      console.error(`db has not been opened, why come here?`);
      return;
    }
    //
    if (!this._closeTime) {
      const openTime = (now - this._openTime) / 1000;
      console.error(`db has not been closed, why? opened in ${openTime} seconds.`);
      return;
    }
    //
    const openTime = (now - this._openTime) / 1000;
    const closeTime = (now - this._closeTime) / 1000;
    const message = `db has been closed: opened in ${openTime} seconds, closed in ${closeTime} seconds`;
    console.error(message);
  }

  //
  async open() {
    await this._lock();
    try {
      assert(!this._db, 'db has been opened');
      this._openTime = new Date().valueOf();
      const ret = await this._open();
      return ret;
    } finally {
      this._unlock();
    }
  }

  async run(sql, values) {
    await this._lock();
    try {
      this._assertOpen();
      return await this._run(sql, values);
    } finally {
      this._unlock();
    }
  }

  async all(sql, values) {
    await this._lock();
    try {
      this._assertOpen();
      return await this._all(sql, values);
    } finally {
      this._unlock();
    }
  }

  async firstRow(sql, values, check = true) {
    const rows = await this.all(sql, values);
    if (rows.length === 1) {
      return rows[0];
    } else if (rows.length === 0) {
      return null;
    }
    //
    if (check) {
      throw new WizInternalError(`too many results: ${sql}, ${values}`);
    }
    return rows[0];
  }

  async fieldValue(sql, values, fieldName, check = true) {
    const row = await this.firstRow(sql, values, check);
    if (!row) {
      return null;
    }
    return row[fieldName];
  }

  async close() {
    await this._lock();
    try {
      this._assertOpen();
      const ret = await this._close();
      this._closeTime = new Date().valueOf();
      this._db = null;
      // console.log('closed');
      return ret;
    } finally {
      this._unlock();
    }
  }

  //
  async tables() {
    const tables = await this.all(`SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';`);
    return tables.map((row) => row.name);
  }

  //
  async update(sqlCommands) {
    await updateDb(this, sqlCommands);
  }
}

//
module.exports = SqliteDb;
