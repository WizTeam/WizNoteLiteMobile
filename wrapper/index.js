import fs from './fs';
import app from './app';
import sqlite3 from './sqlite3';
import Store from './store';

const wizWrapper = {
  fs,
  app,
  sqlite3,
  Store,
};

global.wizWrapper = wizWrapper;

console.log(`appName: ${app.name}, appVersion: ${app.getVersion()}`);

module.exports = {};

