import i18n from 'i18n-js';

import { Navigation } from '../thirdparty/react-native-navigation';
import dataStore from '../data_store';
import api from '../api';
import { getDeviceColor } from '../config/Colors';
import { loadNote } from '../components/NoteEditor';
import { isTablet, isAndroid } from '../utils/device';
import { enableNextAnimation } from './animations';

export async function createNewNote(parentComponentId) {
  //
  enableNextAnimation();
  const kbGuid = dataStore.getCurrentKb();
  const note = await api.createNote(kbGuid);
  dataStore.setCurrentNote(note);
  if (dataStore.getSelectedType() !== '#allNotes') {
    dataStore.setSelectedType('#allNotes');
  }
  //
  if (isTablet()) {
    return;
  }
  //
  loadNote(note, true);
  //
  if (isAndroid) {
    Navigation.push(parentComponentId, {
      component: {
        name: 'ViewNoteScreen',
        passProps: {
          isNewNote: true,
        },
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
  } else {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'ViewNoteScreen',
            passProps: {
              isNewNote: true,
            },
            options: {
              layout: {
                componentBackgroundColor: getDeviceColor('noteBackground'),
              },
              topBar: {
                noBorder: true,
                leftButtons: [{
                  id: 'DoneButton',
                  text: i18n.t('buttonDone'),
                  systemItem: 'done',
                }],
              },
            },
          },
        }],
      },
    });
  }
}
