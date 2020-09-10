import { Navigation } from '../thirdparty/react-native-navigation';
import dataStore from '../data_store';
import api from '../api';
import { getDeviceColor } from '../config/Colors';
import { loadNote } from '../components/NoteEditor';
import { isTablet } from '../utils/device';
import { enableNextAnimation } from './animations';

export async function createNewNote() {
  //
  enableNextAnimation();
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
          // name: 'NewNoteScreen',
          name: 'ViewNoteScreen',
          passProps: {
            isNewNote: true,
          },
          options: {
            layout: {
              componentBackgroundColor: getDeviceColor('noteBackground'),
            },
            topBar: {
              leftButtons: [{
                id: 'DoneButton',
                // eslint-disable-next-line import/no-unresolved
                text: 'Done',
                systemItem: 'done',
              }],
            },
          },
        },
      }],
    },
  });
}
