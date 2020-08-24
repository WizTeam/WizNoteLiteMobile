import React from 'react';
import {
  SafeAreaView,
} from 'react-native';

import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import ThemedStatusBar from '../components/ThemedStatusBar';

import NoteEditor from '../components/NoteEditor';

const NoteScreen: () => React$Node = () => {
  const styles = useDynamicValue(dynamicStyles);

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar />
      <SafeAreaView style={styles.content}>
        <NoteEditor containerStyle={styles.editorContainer} style={styles.editor} />
      </SafeAreaView>
    </ColorSchemeProvider>
  );
};

NoteScreen.options = {
  topBar: {
    title: {
      // text: 'WizNote Lite',
    },
  },
};

const dynamicStyles = new DynamicStyleSheet({
  content: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'green',
  },
  editorContainer: {
    flex: 1,
    backgroundColor: 'green',
  },
  editor: {
    alignSelf: 'center',
    width: '100%',
    // backgroundColor: 'red',
    backgroundColor: 'transparent',
  },
});

export default NoteScreen;
