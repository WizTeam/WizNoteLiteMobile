import './wrapper';
import { Navigation } from 'react-native-navigation';

import { registerScreens } from './screens';
import { setLoginAsRoot, setMainAsRoot } from './services/navigation';
import api from './api';
import { iniI18nConfig } from './i18n';

registerScreens();
//
Navigation.events().registerAppLaunchedListener(async () => {
  try {
    iniI18nConfig();
    await api.localLogin();
  } catch (err) {
    //
  }
  if (api.isLoggedIn()) {
    setMainAsRoot();
  } else {
    setLoginAsRoot();
  }
});
