import { transportFunctionType } from '../index';

/** Web Console color string constants */
const clientColors: Array<string> = [
  '',
  'color: dodgerblue;font-weight:bold',
  'color: orange;font-weight:bold;',
  'color: indianred;font-weight:bold;',
];

const originConsoleLog = console.log;

const colorConsoleSync: transportFunctionType = (msg, level, options) => {
  /**
   * Control msg type
   * Here we use JSON.stringify so you can pass object, array, string, ecc...
   */
  let stringMsg: string;
  if (typeof msg === 'string') {
    stringMsg = msg;
  } else if (typeof msg === 'function') {
    stringMsg = '[function]';
  } else if (msg instanceof Error) {
    const error: any = msg;
    stringMsg = `code=${error['code']}, message=${msg.message}`;
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

  if (options && options.hideDate) dateTxt = '';
  if (options && options.hideLevel) levelTxt = '';

  let output = `${dateTxt}${levelTxt}${stringMsg}`;
  originConsoleLog(output);

  return true;
};

export { colorConsoleSync };