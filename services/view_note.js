import { Navigation } from 'react-native-navigation';

import dataStore from '../data_store';
import { getColor, getDeviceColor } from '../config/Colors';
import { loadNote } from '../components/NoteEditor';

export async function viewNote(parentComponentId) {
  const note = dataStore.getCurrentNote();
  const kbGuid = dataStore.getCurrentKb();
  loadNote(kbGuid, note);
  //
  Navigation.push(parentComponentId, {
    component: {
      name: 'NoteScreen',
      options: {
        layout: {
          componentBackgroundColor: getDeviceColor('noteBackground'),
        },
        bottomTabs: {
          backgroundColor: getColor('bottomTabBackground'),
        },
      },
    },
  });
}
