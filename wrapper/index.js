import 'react-native-get-random-values'; // https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import fs from './fs';
import app from './app';
import sqlite3 from './sqlite3';
import Store from './store';
import enc from './enc';

const wizWrapper = {
  fs,
  app,
  sqlite3,
  enc,
  Store,
};

global.wizWrapper = wizWrapper;

module.exports = {};

