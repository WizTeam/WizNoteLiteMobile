import './wrapper';
import * as RNIap from 'react-native-iap';

import { Navigation } from './thirdparty/react-native-navigation';
import { logger } from './thirdparty/react-native-logs';
import { registerScreens } from './screens';
import { setLoginAsRoot, setMainAsRoot } from './services/navigation';
import { startResourceLoader } from './services/resources_loader';
import api from './api';
import { iniI18nConfig } from './i18n';
import dataStore from './data_store';
import { setDefaultNavigationOptions } from './components/ThemeListener';

const defaultConfig = {
  severity: 'debug',
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
