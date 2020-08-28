import { NativeEventEmitter, NativeModules, Appearance } from 'react-native';
import { Navigation } from 'react-native-navigation';

import dataStore from '../data_store';
import { PORT } from './resources_loader';
import api from '../api';
import { injectJavaScript } from '../components/WizWebView';

const NoteViewer = NativeModules.NoteViewModule;
const eventObject = new NativeEventEmitter(NoteViewer);

export function handleEditorEvent(eventBody) {
  if (eventBody) {
    const data = JSON.parse(eventBody);
    const name = data.event;
    if (name === 'saveData') {
      const contentId = data.contentId;
      const markdown = data.markdown;
      if (!contentId) {
        console.error('no content id');
        return;
      }
      const parts = contentId.split('/');
      const [userGuid, kbGuid, noteGuid] = parts;
      console.log(parts);
      if (!userGuid) {
        console.error('no userGuid');
        return;
      }
      if (!kbGuid) {
        console.error('no kbGuid');
        return;
      }
      if (!noteGuid) {
        console.error('no noteGuid');
        return;
      }
      //
      api.setNoteMarkdown(userGuid, kbGuid, noteGuid, markdown);
    } else {
      console.error(`unknown browser event: ${eventBody}`);
    }
  }
}

eventObject.addListener('onMessage', handleEditorEvent);

export function viewNote(parentComponentId) {
  const note = dataStore.getCurrentNote();
  const kbGuid = dataStore.getCurrentKb();
  const contentId = `${api.userGuid}/${kbGuid}/${note.guid}`;
  const markdown = note.markdown;
  const resourceUrl = `http://localhost:${PORT}/${api.userGuid}/${kbGuid}/${note.guid}`;

  const theme = Appearance.getColorScheme();
  //
  const loadData = JSON.stringify({
    contentId, markdown, resourceUrl, theme,
  });
  //
  injectJavaScript(`window.loadMarkdown(${loadData});`);
  //
  Navigation.push(parentComponentId, {
    component: {
      name: 'NoteScreen', // Push the screen registered with the 'Settings' key
      options: { // Optional options object to configure the screen
        topBar: {
          title: {
          },
        },
        bottomTabs: {
          visible: false,
        },
      },
    },
  });
}
