import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import { Navigation } from '../thirdparty/react-native-navigation';
import ThemedStatusBar from '../components/ThemedStatusBar';
import NoteEditor from '../components/NoteEditor';
import { getDeviceDynamicColor } from '../config/Colors';
import { enableNextAnimation } from '../services/animations';
import dataStore from '../data_store';
import api from '../api';

const NewNoteScreen: () => React$Node = (props) => {
  const styles = useDynamicValue(dynamicStyles);

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
      if (buttonId === 'DoneButton') {
        Navigation.dismissModal(props.componentId);
      }
    });
    return () => listener.remove();
  }, []);

  const oldMarkdownRef = useRef('');
  useEffect(() => {
    //
    const note = dataStore.getCurrentNote();
    (async () => {
      oldMarkdownRef.current = await api.getNoteMarkdown(note.kbGuid, note.guid);
    })();
    //
    return () => {
      (() => {
        setTimeout(async () => {
          const markdown = await api.getNoteMarkdown(note.kbGuid, note.guid);
          if (oldMarkdownRef.current === markdown) {
            enableNextAnimation();
            await api.deleteNote(note.kbGuid, note.guid);
          }
        }, 500);
      })();
    };
  }, []);

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar />
      <SafeAreaView style={styles.content}>
        <NoteEditor containerStyle={styles.editorContainer} style={styles.editor} />
      </SafeAreaView>
    </ColorSchemeProvider>
  );
};

NewNoteScreen.options = {
  topBar: {
    title: {
    },
    leftButtons: [{
      id: 'DoneButton',
      // eslint-disable-next-line import/no-unresolved
      text: 'Done',
      systemItem: 'done',
    }],
  },
  bottomTabs: {
    visible: false,
  },
  animations: {
    push: {
      waitForRender: true,
    },
  },
  layout: {
    orientation: ['portrait'],
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

export default NewNoteScreen;
