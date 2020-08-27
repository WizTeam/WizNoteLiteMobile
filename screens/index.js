import { Navigation } from 'react-native-navigation';
import { RNNDrawer } from 'react-native-navigation-drawer-extension';

import MainDrawer from '../components/MainDrawer';

export function registerScreens() {
  Navigation.registerComponent('SearchNotesField', () => require('../components/SearchNotesField').default);
  Navigation.registerComponent('TopBarFlashMessages', () => require('../components/TopBarMessage').default);
  Navigation.registerComponent('MainDrawer', () => RNNDrawer.create(MainDrawer));
  Navigation.registerComponent('LoginScreen', () => require('./LoginScreen').default);
  Navigation.registerComponent('NotesScreen', () => require('./NotesScreen').default);
  Navigation.registerComponent('NoteScreen', () => require('./NoteScreen').default);
  Navigation.registerComponent('StarredNotesScreen', () => require('./StarredNotesScreen').default);
  Navigation.registerComponent('SearchNotesScreen', () => require('./SearchNotesScreen').default);
  Navigation.registerComponent('PadMainScreen', () => require('./PadMainScreen').default);
}
