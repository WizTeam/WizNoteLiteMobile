import './wrapper';
import { Navigation } from 'react-native-navigation';
import * as RNIap from 'react-native-iap';

import { registerScreens } from './screens';
import { setLoginAsRoot, setMainAsRoot } from './services/navigation';
import { startResourceLoader } from './services/resources_loader';
import api from './api';
import { iniI18nConfig } from './i18n';
import dataStore from './data_store';
import { setDefaultNavigationOptions } from './components/ThemeListener';

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
