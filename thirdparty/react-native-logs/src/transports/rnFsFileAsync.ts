import { transportFunctionType } from '../index';

declare var require: any;

const RNFS = require('react-native-fs');

const originConsoleLog = console.log;

const rnFsFileAsync: transportFunctionType = async (msg, level, options) => {
  if (!RNFS) return false;
  if (level.severity <= 0) return true;

  /**
   * Control msg type
   * Here we use JSON.stringify so you can pass object, array, string, ecc...
   */
  let stringMsg: string;
  if (typeof msg === 'string') {
    stringMsg = msg;
  } else if (msg instanceof Error) {
    const error: any = msg;
    stringMsg = `code=${error['code']}, message=${msg.message}`;
  } else if (typeof msg === 'function') {
    stringMsg = '[function]';
  } else {
    stringMsg = JSON.stringify(msg);
  }

  let dateTxt;
  if (options && options.dateFormat === 'utc') {
    dateTxt = `${new Date().toUTCString()} | `;
  } else if (options && options.dateFormat === 'iso') {
    dateTxt = `${new Date().toISOString()} | `;
  } else {
    dateTxt = `${new Date().toLocaleString()} | `;
  }
  
  let levelTxt = `${level.text.toUpperCase()} | `;
  let loggerName = 'wiznote';
  let loggerPath = RNFS.DocumentDirectoryPath;

  if (options && options.hideDate) dateTxt = '';
  if (options && options.hideLevel) levelTxt = '';
  if (options && options.loggerName) loggerName = options.loggerName;
  if (options && options.loggerPath) loggerPath = options.loggerPath;

  let output = `${dateTxt}${levelTxt}${stringMsg}\n`;
  var path = loggerPath + '/' + loggerName + '.txt';
  //
  try {
    const statResult = await RNFS.stat(path);
    if (statResult.size > 50 * 1024) {
      await RNFS.unlink(path);
    }
  } catch(err) {
    originConsoleLog(err);
  }
  //
  RNFS.appendFile(path, output, 'utf8')
    .then(() => {})
    .catch((err: any) => {
      originConsoleLog(err);
    });
};

export { rnFsFileAsync };
