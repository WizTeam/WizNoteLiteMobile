import './wrapper';
import { Navigation } from 'react-native-navigation';

import { registerScreens } from './screens';
import { setLoginAsRoot, setMainAsRoot, setDefaultNavigationOptions } from './services/navigation';
import { startResourceLoader } from './services/resources_loader';
import api from './api';
import { iniI18nConfig } from './i18n';
import dataStore from './data_store';

const SyncStorage = require('sync-storage').default;

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
