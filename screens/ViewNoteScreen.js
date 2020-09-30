import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { ColorSchemeProvider, useDynamicValue } from 'react-native-dynamic';

import ThemedStatusBar from '../components/ThemedStatusBar';
import { Navigation } from '../thirdparty/react-native-navigation';
import NoteEditor from '../components/NoteEditor';
import { setFocus, endEditing } from '../components/WizSingletonWebView';

import { enableNextAnimation } from '../services/animations';
import { getDeviceDynamicColor, getColor, createDeviceDynamicStyles } from '../config/Colors';
import dataStore from '../data_store';
import api from '../api';
import EditorToolBar from '../components/EditorToolbar';

const ViewNoteScreen: () => React$Node = (props) => {
  const styles = useDynamicValue(dynamicStyles.styles);
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);

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
    if (!props.isNewNote) {
      return undefined;
    }
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

  function handleBeginEditing({ keyboardHeight, animationDuration }) {
    toolbarRef.current.show(true, keyboardHeight, animationDuration);
  }

  function handleEndEditing({ animationDuration }) {
    toolbarRef.current.hide(true, animationDuration);
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [],
      },
    });
  }

  function handleThemeChanged() {
    // force update buttons color
    console.debug('update view note screen theme');
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        background: {
          color: getColor('topBarBackground'),
        },
      },
    });
  }

  useEffect(() => {
    const navigationEventListener = Navigation.events().registerComponentDidAppearListener(
      ({ componentId }) => {
        if (componentId === props.componentId && props.isNewNote) {
          setTimeout(() => {
            setFocus();
          }, 300);
        }
      },
    );
    return () => {
      navigationEventListener.remove();
    };
  }, []);

  useEffect(() => {
    const navigationEventListener = Navigation.events().registerComponentDidDisappearListener(
      ({ componentId }) => {
        if (componentId === props.componentId) {
          // console.log('view note screen disappeared, end editing');
          endEditing(true);
        }
      },
    );
    return () => {
      navigationEventListener.remove();
    };
  }, []);

  useEffect(() => {
    toolbarRef.current.setEditor(editorRef.current);
  }, []);

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar onThemeChanged={handleThemeChanged} />
      <SafeAreaView style={styles.content}>
        <NoteEditor
          ref={editorRef}
          containerStyle={styles.editorContainer}
          style={styles.editor}
          onBeginEditing={handleBeginEditing}
          onEndEditing={handleEndEditing}
          onChangeSelection={(status) => toolbarRef.current?.changeToolbarType(status)}
        />
        <EditorToolBar ref={toolbarRef} />
      </SafeAreaView>
    </ColorSchemeProvider>
  );
};

ViewNoteScreen.options = {
  topBar: {
    noBorder: true,
    title: {
    },
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

const dynamicStyles = createDeviceDynamicStyles(() => ({
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
}));

export default ViewNoteScreen;
