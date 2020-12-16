import { Navigation } from '../thirdparty/react-native-navigation';
import { RNNDrawer } from '../thirdparty/react-native-navigation-drawer-extension';
import MainDrawer from '../components/MainDrawer';

export function registerScreens() {
  Navigation.registerComponent('SearchNotesField', () => require('../components/SearchNotesField').default);
  Navigation.registerComponent('TopBarFlashMessages', () => require('../components/TopBarMessage').default);
  Navigation.registerComponent('MainDrawer', () => RNNDrawer.create(MainDrawer));
  Navigation.registerComponent('LoginScreen', () => require('./LoginScreen').default);
  Navigation.registerComponent('NotesScreen', () => require('./NotesScreen').default);
  Navigation.registerComponent('ViewNoteScreen', () => require('./ViewNoteScreen').default);
  Navigation.registerComponent('PadMainScreen', () => require('./PadMainScreen').default);
  Navigation.registerComponent('UpgradeToVipScreen', () => require('./UpgradeToVipScreen').default);
  Navigation.registerComponent('ViewLogsScreen', () => require('./ViewLogsScreen').default);
  Navigation.registerComponent('NoteLinksScreen', () => require('./NoteLinksScreen').default);
}
