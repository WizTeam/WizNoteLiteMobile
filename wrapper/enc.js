const aesjs = require('aes-js');
const sha256 = require('js-sha256');
const base64 = require('js-base64');

const IV_LENGTH = 16;

function concatTypedArrays(a, b) { // a, b TypedArray of same type
  const c = new (a.constructor)(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

function concatBytes(ui8a, byte) {
  const b = new Uint8Array(1);
  b[0] = byte;
  return concatTypedArrays(ui8a, b);
}

function paddingBytes(bytes) {
  const paddingLength = 16 - (bytes.length % 16);
  for (let i = 0; i < paddingLength; i++) {
    // eslint-disable-next-line no-param-reassign
    bytes = concatBytes(bytes, paddingLength);
  }
  return bytes;
}

function removePaddingBytes(bytes) {
  const paddingLength = bytes[bytes.length - 1];
  if (paddingLength < 0 || paddingLength >= 16) {
    throw new Error('invalid paddingLength');
  }
  for (let i = 1; i <= paddingLength; i++) {
    if (bytes[bytes.length - i] !== paddingLength) {
      throw new Error('invalid padding data');
    }
  }
  return bytes.subarray(0, bytes.length - paddingLength);
}

function passwordToKey(password) {
  const key = base64.encode(sha256(password)).substr(0, 16);
  return Array.from(key).map((s) => s.charCodeAt(0));
}

function encryptText(text, password) {
  if (!text) {
    return '';
  }
  const iv = new Uint8Array(IV_LENGTH);
  // eslint-disable-next-line no-undef
  crypto.getRandomValues(iv);
  const key = passwordToKey(password);
  // eslint-disable-next-line new-cap
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const textBytes = paddingBytes(aesjs.utils.utf8.toBytes(text));
  const encryptedBytes = aesCbc.encrypt(textBytes);
  const ivData = aesjs.utils.hex.fromBytes(iv);
  const resultData = aesjs.utils.hex.fromBytes(encryptedBytes);
  return `${ivData}:${resultData}`;
}

function decryptText(text, password) {
  if (!text) {
    return '';
  }
  const textParts = text.split(':');
  const iv = aesjs.utils.hex.toBytes(textParts.shift(), 'hex');
  const encryptedBytes = aesjs.utils.hex.toBytes(textParts.join(':'), 'hex');
  // eslint-disable-next-line new-cap
  const aesCbc = new aesjs.ModeOfOperation.cbc(passwordToKey(password), iv);
  const decryptedBytes = removePaddingBytes(aesCbc.decrypt(encryptedBytes));
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decryptedText;
}

export default {
  aes: {
    encryptText,
    decryptText,
  },
};
