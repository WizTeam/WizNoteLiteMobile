import React from 'react';
import {
  SafeAreaView,
} from 'react-native';

import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import ThemedStatusBar from '../components/ThemedStatusBar';
import NoteEditor from '../components/NoteEditor';
import { getDeviceDynamicColor } from '../config/Colors';

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
  layout: {
    componentBackgroundColor: '#282828',
  },
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
    backgroundColor: getDeviceDynamicColor('noteBackground'),
  },
  editorContainer: {
    flex: 1,
    backgroundColor: getDeviceDynamicColor('noteBackground'),
  },
  editor: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: getDeviceDynamicColor('noteBackground'),
  },
});

export default NoteScreen;
