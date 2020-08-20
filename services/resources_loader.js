const axios = require('axios');
const httpBridge = require('../thirdparty/react-native-http-bridge');

export const PORT = 5569;

export function startResourceLoader() {
  console.log(1);
  httpBridge.start(PORT, 'http_service', (request) => {
    console.log(2);
    // you can use request.url, request.type and request.postData here
    if (request.type === 'GET') {
      console.log(request.url);
      const mime = 'application/json';
      httpBridge.respond(request.requestId, 200, mime, '{"message": "OK"}');
    } else {
      httpBridge.respond(request.requestId, 400, 'application/json', '{"message": "Bad Request"}');
    }
  });

  setTimeout(async () => {
    const ret = await axios(`http://localhost:${PORT}/1/2/3/4`);
    console.log(ret.data);
  }, 1000);
}
