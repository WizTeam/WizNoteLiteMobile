import { NativeEventEmitter, NativeModules, Appearance } from 'react-native';
import { Navigation } from 'react-native-navigation';

import dataStore from '../data_store';
import { PORT } from './resources_loader';
import api from '../api';

const NoteViewer = NativeModules.NoteViewModule;
const eventObject = new NativeEventEmitter(NoteViewer);

eventObject.addListener('onMessage', (body) => {
  console.log(body);
});

export function viewNote(parentComponentId) {
  const note = dataStore.getCurrentNote();
  const kbGuid = dataStore.getCurrentKb();
  const contentId = note.guid;
  const markdown = note.markdown;
  const resourceUrl = `http://localhost:${PORT}/${api.userGuid}/${kbGuid}/${note.guid}`;

  const theme = Appearance.getColorScheme();
  //
  const loadData = JSON.stringify({
    contentId, markdown, resourceUrl, theme,
  });
  //
  Navigation.push(parentComponentId, {
    externalComponent: {
      name: 'NoteViewScreen', // Push the screen registered with the 'Settings' key
      options: { // Optional options object to configure the screen
        topBar: {
          title: {
          },
        },
        bottomTabs: {
          visible: false,
        },
      },
      passProps: {
        loadData,
        theme,
      },
    },
  });
}
