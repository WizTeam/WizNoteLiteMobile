import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { getResourceBaseUrl } from '../services/resources_loader';
import { KEYS, connect } from '../data_store';
import api from '../api';
import WizSingletonWebView, { addWebViewEventHandler, injectJavaScript, endEditing } from './WizSingletonWebView';

addWebViewEventHandler('onMessage', (eventBody) => {
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
  } else if (name === 'onKeyDown') {
    // do nothing
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

export function editorFocus() {
  const js = `window.editorFocus();true;`;
  injectJavaScript(js);
}

export async function loadNote(kbGuid, note) {
  if (!note) {
    return;
  }
  // console.log(`load note: ${note.markdown}`);
  const data = {
    markdown: note.markdown,
    resourceUrl: getResourceBaseUrl(api.userGuid, kbGuid, note.guid),
    contentId: `${api.userGuid}/${kbGuid}/${note.guid}`,
  };
  const dataText = JSON.stringify(data);
  const js = `window.loadMarkdown(${dataText});true;`;
  await injectJavaScript(js);
}

const NoteEditor: () => React$Node = (props) => {
  //
  // 清空编辑器，可以强制进行保存
  useEffect(() => emptyEditor, []);
  const keyboardVisibleTimeRef = useRef(0);
  const keyboardVisibleRef = useRef(false);

  function handleScroll() {
    if (keyboardVisibleRef.current) {
      const now = new Date().valueOf();
      if (now - keyboardVisibleTimeRef.current > 1000) {
        endEditing(true);
      }
    }
  }

  function handleKeyboardShow() {
    keyboardVisibleRef.current = true;
    keyboardVisibleTimeRef.current = new Date().valueOf();
  }

  function handleKeyboardHide() {
    keyboardVisibleRef.current = false;
  }

  function handleMessage({ nativeEvent }) {
    const data = JSON.parse(nativeEvent.body);
    const name = data.event;
    if (name === 'onKeyDown') {
      keyboardVisibleTimeRef.current = new Date().valueOf();
    }
  }

  const kbGuid = props[KEYS.CURRENT_KB];
  const note = props[KEYS.CURRENT_NOTE];

  useEffect(() => {
    loadNote(kbGuid, note);
  }, [note]);

  return (
    <View style={props.containerStyle}>
      <WizSingletonWebView
        onScroll={handleScroll}
        onKeyboardShow={handleKeyboardShow}
        onKeyboardHide={handleKeyboardHide}
        onMessage={handleMessage}
        style={props.editorStyle}
      />
    </View>
  );
};

export default connect([
  KEYS.CURRENT_KB,
  KEYS.CURRENT_NOTE,
])(NoteEditor);
