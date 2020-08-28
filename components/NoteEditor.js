import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';

import { PORT } from '../services/resources_loader';
import { KEYS, connect } from '../data_store';
import api from '../api';
import app from '../wrapper/app';
import { handleEditorEvent } from '../services/view_note';
import WizWebView from './WizWebView';

const NoteEditor: () => React$Node = (props) => {
  const webViewRef = useRef(null);
  const isLoadedRef = useRef(false);
  //
  function loadNote(note) {
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
    webViewRef.current.injectJavaScript(js);
  }
  //
  const note = props[KEYS.CURRENT_NOTE];
  const kbGuid = props[KEYS.CURRENT_KB];
  //
  useEffect(() => {
    //
    if (!isLoadedRef.current) {
      console.log('web is not loaded');
      return;
    }
    //
    loadNote(note);
    //
  }, [note, kbGuid]);

  useEffect(() => (
    () => {
      const dataText = JSON.stringify({
        contentId: '',
        markdown: '',
        resourceUrl: '',
      });
      const js = `window.loadMarkdown(${dataText});true;`;
      webViewRef.current.injectJavaScript(js);
    }
  ), []);

  function handleLoaded() {
    if (!isLoadedRef.current) {
      isLoadedRef.current = true;
      setTimeout(() => {
        loadNote(note);
      });
    }
  }

  function handleMessage(event) {
    const body = event.nativeEvent.data;
    if (body) {
      handleEditorEvent(body);
    }
  }
  //
  const isDarkMode = useDarkMode();
  const theme = isDarkMode ? 'dark' : 'lite';
  //
  const resPath = app.getPath('res');
  const editorHtmlPath = `file://${resPath}/build/index.html?theme=${theme}`;
  // const editorHtmlPath = `http://localhost:3000?theme=${theme}`;
  // console.log(`load html: ${editorHtmlPath}`);
  //
  return (
    <View style={props.containerStyle}>
      <WizWebView
        ref={(r) => { webViewRef.current = r; }}
        style={props.editorStyle}
        // originWhitelist={['*']}
        url={editorHtmlPath}
        onLoad={handleLoaded}
        onMessage={handleMessage}
      />
    </View>
  );
};

export default connect([
  KEYS.CURRENT_KB,
  KEYS.CURRENT_NOTE,
])(NoteEditor);
