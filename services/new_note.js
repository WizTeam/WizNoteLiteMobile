import { Navigation } from '../thirdparty/react-native-navigation';
import dataStore from '../data_store';
import api from '../api';
import { getDeviceColor } from '../config/Colors';
import { loadNote } from '../components/NoteEditor';
import { isTablet } from '../utils/device';

export async function createNewNote() {
  //
  const kbGuid = dataStore.getCurrentKb();
  const note = await api.createNote(kbGuid);
  dataStore.setCurrentNote(note);
  if (dataStore.getSelectedType() !== '#allNotes') {
    dataStore.setSelectedType('#allNotes');
  }
  //
  if (isTablet) {
    return;
  }
  //
  loadNote(kbGuid, note);
  //
  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: 'NewNoteScreen',
          options: {
            layout: {
              componentBackgroundColor: getDeviceColor('noteBackground'),
            },
          },
        },
      }],
    },
  });
}
