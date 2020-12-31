import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { ColorSchemeProvider, useDynamicValue } from 'react-native-dynamic';

import ThemedStatusBar from '../components/ThemedStatusBar';
import { Navigation } from '../thirdparty/react-native-navigation';
import NoteEditor from '../components/NoteEditor';
import { setFocus, endEditing, toggleKeyboard } from '../components/WizSingletonWebView';

import { enableNextAnimation } from '../services/animations';
import { getDeviceDynamicColor, getColor, createDeviceDynamicStyles } from '../config/Colors';
import dataStore from '../data_store';
import api from '../api';
import EditorToolBar from '../components/EditorToolbar';
import { isAndroid, isIos } from '../utils/device';

const ViewNoteScreen: () => React$Node = (props) => {
  const styles = useDynamicValue(dynamicStyles.styles);
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);

  async function handleInsertImage() {
    toggleKeyboard(false);
    //
    try {
      const js = 'window.onBeforeInsert();true;';
      await editorRef.current.injectJavaScript(js);
    } catch (err) {
      console.log(err);
    }
    //
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error(`ImagePicker Error: ${response.error?.message}`);
      } else if (response.customButton) {
        console.log(`User tapped custom button: ${response.customButton}`);
      } else {
        //
        console.log(response.type);
        //
        const note = dataStore.getCurrentNote();
        let resourceUrl;
        if (isIos && response.uri) {
          resourceUrl = await api.addImageFromUrl(note.kbGuid, note.guid, response.uri);
        } else if (isAndroid && response.path) {
          resourceUrl = await api.addImageFromUrl(note.kbGuid, note.guid, response.path);
        } else if (response.data) {
          const type = response.type;
          resourceUrl = await api.addImageFromData(note.kbGuid, note.guid, response.data, {
            base64: true,
            type: {
              ext: type.substr(6),
              mime: type,
            },
          });
        }
        if (resourceUrl) {
          if (editorRef.current) {
            const js = `window.addImage('${resourceUrl}');true;`;
            try {
              await editorRef.current.injectJavaScript(js);
            } catch (err) {
              console.log(err.message);
            }
          }
        }
      }
    });
  }

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(
      async ({ buttonId }) => {
        if (buttonId === 'DoneButton') {
          Navigation.dismissModal(props.componentId);
        } else if (buttonId === 'redo') {
          editorRef.current.executeCommand('redo');
        } else if (buttonId === 'revoke') {
          editorRef.current.executeCommand('undo');
        }
      },
    );
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
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'noteInfoDrawer',
            // eslint-disable-next-line import/no-unresolved
            icon: require('../images/icons/menu.png'),
          },
          {
            id: 'redo',
            // eslint-disable-next-line import/no-unresolved
            icon: require('../images/icons/redo.png'),
          },
          {
            id: 'revoke',
            // eslint-disable-next-line import/no-unresolved
            icon: require('../images/icons/revoke.png'),
          },
        ],
      },
    });
  }

  function handleEndEditing({ animationDuration }) {
    toolbarRef.current.hide(true, animationDuration);
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'noteInfoDrawer',
            // eslint-disable-next-line import/no-unresolved
            icon: require('../images/icons/menu.png'),
          },
        ],
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
  statusBar: {
    translucent: false,
    drawBehind: true,
    backgroundColor: 'transparent',
  },
  topBar: {
    noBorder: true,
    title: {
    },
    rightButtons: [{
      id: 'noteInfoDrawer',
      // eslint-disable-next-line import/no-unresolved
      icon: require('../images/icons/menu.png'),
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
