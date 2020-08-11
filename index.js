import './wrapper';
import { Navigation } from 'react-native-navigation';

import { registerScreens } from './screens';
import { setLoginAsRoot, setMainAsRoot } from './services/navigation';
import api from './api';
import { iniI18nConfig } from './i18n';

const SyncStorage = require('sync-storage').default;

registerScreens();
//
Navigation.events().registerAppLaunchedListener(async () => {
  try {
    await SyncStorage.init();
    iniI18nConfig();
    await api.localLogin();
    api.syncData();
  } catch (err) {
    //
  }
  if (api.isLoggedIn()) {
    setMainAsRoot();
  } else {
    setLoginAsRoot();
  }
});
