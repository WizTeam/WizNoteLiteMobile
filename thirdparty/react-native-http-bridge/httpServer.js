/**
 * @providesModule react-native-http-server
 */
import { NativeEventEmitter, NativeModules } from 'react-native';

const Server = NativeModules.HttpServer;
const eventObject = new NativeEventEmitter(Server);

module.exports = {
  start: function start(port, serviceName, callback) {
    if (port === 80) {
      throw new Error('Invalid server port specified. Port 80 is reserved.');
    }

    Server.start(port, serviceName);
    eventObject.addListener('httpServerResponseReceived', callback);
  },

  stop: function stop() {
    Server.stop();
    eventObject.removeAllListeners('httpServerResponseReceived');
  },

  respond: function respond(requestId, code, type, body) {
    Server.respond(requestId, code, type, body);
  },

  respondWithFile: function respondWithFile(requestId, code, type, file) {
    Server.respondWithFile(requestId, code, type, file);
  },
};
