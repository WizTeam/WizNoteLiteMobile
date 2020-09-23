import { Navigation } from '../thirdparty/react-native-navigation';
import dataStore from '../data_store';
import { getDeviceColor } from '../config/Colors';
import { loadNote } from '../components/NoteEditor';

export async function viewNote(parentComponentId) {
  const note = dataStore.getCurrentNote();
  loadNote(note);
  //
  Navigation.push(parentComponentId, {
    component: {
      name: 'ViewNoteScreen',
      options: {
        layout: {
          componentBackgroundColor: getDeviceColor('noteBackground'),
        },
        topBar: {
          noBorder: true,
        },
      },
    },
  });
}
