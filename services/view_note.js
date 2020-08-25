import { NativeEventEmitter, NativeModules } from 'react-native';
import { Navigation } from 'react-native-navigation';

import dataStore from '../data_store';
import { PORT } from './resources_loader';
import api from '../api';

const NoteViewer = NativeModules.NoteViewModule;
const eventObject = new NativeEventEmitter(NoteViewer);

eventObject.addListener('saveNote', (contentId, markdown) => {
  console.log(`handle save note: ${contentId}, ${markdown}`);
});

export function viewNote(parentComponentId) {
  const note = dataStore.getCurrentNote();
  const kbGuid = dataStore.getCurrentKb();
  const contentId = note.guid;
  const markdown = note.markdown;
  const resourceUrl = `http://localhost:${PORT}/${api.userGuid}/${kbGuid}/${note.guid}`;

  const options = {
    contentId, markdown, resourceUrl,
  };
  NoteViewer.willLoadNote(JSON.stringify(options));
  //
  Navigation.push(parentComponentId, {
    externalComponent: {
      name: 'NoteViewScreen', // Push the screen registered with the 'Settings' key
      options: { // Optional options object to configure the screen
        topBar: {
          title: {
            // text: 'Settings', // Set the TopBar title of the new Screen
          },
        },
      },
    },
  });
}
