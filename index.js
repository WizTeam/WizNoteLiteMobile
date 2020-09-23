import './wrapper';
import * as RNIap from 'react-native-iap';

import { Navigation } from './thirdparty/react-native-navigation';
import { logger } from './thirdparty/react-native-logs';
import { rnFsFileAsync } from './thirdparty/react-native-logs/src/transports/rnFsFileAsync.ts';
import { colorConsoleSync } from './thirdparty/react-native-logs/src/transports/colorConsoleSync.ts';
import { registerScreens } from './screens';
import { setLoginAsRoot, setMainAsRoot } from './services/navigation';
import { startResourceLoader } from './services/resources_loader';
import api from './api';
import { iniI18nConfig } from './i18n';
import dataStore from './data_store';
import { setDefaultNavigationOptions } from './components/ThemeListener';

const defaultConfig = {
  severity: 'debug',
  transport: (msg, level, options) => {
    colorConsoleSync(msg, level, options);
    rnFsFileAsync(msg, level, options);
  },
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
};
const customLog = logger.createLogger(defaultConfig);
console.debug = customLog.debug;
console.info = customLog.info;
console.error = customLog.error;
console.warn = customLog.warn;
console.log = customLog.info;

const SyncStorage = require('sync-storage').default;

RNIap.initConnection().then((connect) => {
  console.log('RNIap initConnection', connect);
});

registerScreens();
setDefaultNavigationOptions();
//
Navigation.events().registerAppLaunchedListener(async () => {
  try {
    await SyncStorage.init();
    iniI18nConfig();
    startResourceLoader();
    const user = await api.localLogin();
    if (user) {
      await dataStore.initUser();
    }
  } catch (err) {
    console.error(err);
  }
  if (api.isLoggedIn()) {
    setMainAsRoot();
  } else {
    setLoginAsRoot();
  }
});
