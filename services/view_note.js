import { Navigation } from '../thirdparty/react-native-navigation';
import dataStore from '../data_store';
import { getDeviceColor, getThemeColor } from '../config/Colors';
import { loadNote } from '../components/NoteEditor';

export async function viewNote(parentComponentId, theme) {
  const note = dataStore.getCurrentNote();
  loadNote(note);
  //
  Navigation.push(parentComponentId, {
    component: {
      name: 'ViewNoteScreen',
      options: {
        layout: {
          componentBackgroundColor: theme ? getThemeColor(theme).primary : getDeviceColor('noteBackground'),
        },
        topBar: {
          noBorder: true,
          background: { color: theme ? getThemeColor(theme).primary : undefined },
        },
      },
    },
  });
}
