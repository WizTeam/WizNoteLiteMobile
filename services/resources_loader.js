const axios = require('axios');
const url = require('url');
const path = require('path');
const sdk = require('wiznote-sdk-js');
const fs = require('react-native-fs');
const mime = require('mime-types');

const httpBridge = require('../thirdparty/react-native-http-bridge');

const { lockers, paths } = sdk.core;

export const PORT = 5569;

async function handleRequest(request) {
  const u = url.parse(request.url);
  let p = u.path;
  console.log(`handle path: ${p}`);
  while (p.startsWith('/')) {
    p = p.substr(1);
  }
  const parts = p.split('/');
  if (parts.length !== 5) {
    throw new Error(`invalid url format, parts. ${p}`);
  }
  //
  const [userGuid, kbGuid, noteGuid, , resName] = parts;
  const key = `${userGuid}/${kbGuid}/${noteGuid}/${resName}`;
  try {
    await lockers.lock(key);
    const resourceBasePath = paths.getNoteResources(userGuid, kbGuid, noteGuid);
    const resourcePath = path.join(resourceBasePath, resName);
    if (!await fs.exists(resourcePath)) {
      try {
        await sdk.downloadNoteResource(userGuid, kbGuid, noteGuid, resName);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
    //
    const contentType = mime.lookup(resName);
    httpBridge.respondWithFile(request.requestId, 200, contentType, resourcePath);
  } finally {
    lockers.release(key);
  }
}

export function startResourceLoader() {
  console.log('start http server');
  httpBridge.start(PORT, 'http_service', async (request) => {
    // you can use request.url, request.type and request.postData here
    if (request.type === 'GET') {
      try {
        await handleRequest(request);
      } catch (err) {
        console.error(`failed to get resource: ${err.message}`);
        const result = {
          message: err.message,
        };
        httpBridge.respond(request.requestId, 400, 'application/json', JSON.stringify(result, null, 2));
      }
    } else {
      httpBridge.respond(request.requestId, 400, 'application/json', '{"message": "Bad Request"}');
    }
  });

  setTimeout(async () => {
    try {
      const ret = await axios(`http://localhost:${PORT}/6d4038e3-e78e-102c-91bb-4abbcbc78238/1bb811b2-3a09-11e2-a9b7-907ab51b66ae/fd82ea8e-b7a3-43a8-9229-aa7a7cdaabe1/index_files/en-preview.gif`);
      console.log(ret.data);
    } catch (err) {
      console.error(err);
    }
  }, 1000);
}
