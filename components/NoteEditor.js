import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDarkMode } from 'react-native-dynamic';

import { PORT } from '../services/resources_loader';
import dataStore, { KEYS, connect } from '../data_store';
import app from '../wrapper/app';

const NoteEditor: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initStarredNotes();
  }, []);

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
      resourceUrl: `http://localhost:${PORT}/res/${note.kbGuid}/${note.guid}`,
      contentId: note.guid,
    };
    const dataText = JSON.stringify(data);
    const js = `window.loadMarkdown(${dataText});true;`;
    webViewRef.current.injectJavaScript(js);
  }
  //
  useEffect(() => {
    //
    if (!isLoadedRef.current) {
      console.log('web is not loaded');
      return;
    }
    //
    const note = props[KEYS.CURRENT_NOTE];
    loadNote(note);
    //
  }, [props[KEYS.CURRENT_NOTE]]);

  function handleLoaded() {
    if (!isLoadedRef.current) {
      isLoadedRef.current = true;
      setTimeout(() => {
        const note = props[KEYS.CURRENT_NOTE];
        loadNote(note);
      });
    }
  }
  //
  const isDarkMode = useDarkMode();
  const theme = isDarkMode ? 'dark' : 'lite';
  //
  const resPath = app.getPath('res');
  const editorHtmlPath = `file://${resPath}/build/index.html?theme=${theme}`;
  //
  return (
    <View style={props.containerStyle}>
      <WebView
        ref={(r) => { webViewRef.current = r; }}
        style={props.editorStyle}
        originWhitelist={['*']}
        source={{
          uri: editorHtmlPath,
        }}
        onLoad={handleLoaded}
      />
    </View>
  );
};

export default connect([KEYS.CURRENT_NOTE])(NoteEditor);
