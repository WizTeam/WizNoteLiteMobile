/* eslint-disable global-require */
import { Navigation } from 'react-native-navigation';
import { RNNDrawer } from 'react-native-navigation-drawer-extension';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import MainDrawer from '../components/MainDrawer';
import MainMenuButton from '../components/MainMenuButton';

export function registerScreens() {
  Navigation.registerComponent('MainDrawer', () => RNNDrawer.create(MainDrawer));
  Navigation.registerComponent('MainMenuButton', () => MainMenuButton);
  Navigation.registerComponent('LoginScreen', () => require('./LoginScreen').default);
  Navigation.registerComponent('NotesScreen', () => require('./NotesScreen').default);
  Navigation.registerComponent('StarredNotesScreen', () => require('./StarredNotesScreen').default);
  Navigation.registerComponent('SearchNotesScreen', () => require('./SearchNotesScreen').default);
  Navigation.registerComponent('PadMainScreen', () => gestureHandlerRootHOC(require('./PadMainScreen').default));
}
