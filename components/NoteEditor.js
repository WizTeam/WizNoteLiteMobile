import React, { useEffect } from 'react';
import { View } from 'react-native';

import { PORT } from '../services/resources_loader';
import { KEYS, connect } from '../data_store';
import api from '../api';
import WizSingletonWebView, { addWebViewEventHandler, injectJavaScript } from './WizSingletonWebView';

addWebViewEventHandler('onMessage', (eventBody) => {
  const data = JSON.parse(eventBody);
  const name = data.event;
  console.log(data);
  if (name === 'saveData') {
    const contentId = data.contentId;
    const markdown = data.markdown;
    if (!contentId) {
      console.error('no content id');
      return;
    }
    const parts = contentId.split('/');
    // eslint-disable-next-line no-shadow
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
});

export function emptyEditor() {
  const dataText = JSON.stringify({
    contentId: '',
    markdown: '',
    resourceUrl: '',
  });
  const js = `window.loadMarkdown(${dataText});true;`;
  injectJavaScript(js);
}

export async function loadNote(kbGuid, note) {
  if (!note) {
    return;
  }
  // console.log(`load note: ${note.markdown}`);
  const data = {
    markdown: note.markdown,
    resourceUrl: `http://localhost:${PORT}/${api.userGuid}/${kbGuid}/${note.guid}`,
    contentId: `${api.userGuid}/${kbGuid}/${note.guid}`,
  };
  const dataText = JSON.stringify(data);
  const js = `window.loadMarkdown(${dataText});true;`;
  await injectJavaScript(js);
}

const NoteEditor: () => React$Node = (props) => {
  //
  // const note = props[KEYS.CURRENT_NOTE];
  // const kbGuid = props[KEYS.CURRENT_KB];
  //
  // useEffect(() => {
  //   loadNote(kbGuid, note);
  // }, [note, kbGuid]);

  useEffect(() => emptyEditor, []);

  return (
    <View style={props.containerStyle}>
      <WizSingletonWebView
        style={props.style}
      />
    </View>
  );
};

export default connect([
  KEYS.CURRENT_KB,
  KEYS.CURRENT_NOTE,
])(NoteEditor);
