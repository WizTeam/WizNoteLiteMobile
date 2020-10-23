import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import i18n from 'i18n-js';

import { getResourceBaseUrl } from '../services/resources_loader';
import { KEYS, connect } from '../data_store';
import api from '../api';
import app from '../wrapper/app';
import fs from '../wrapper/fs';
import { isTablet } from '../utils/device';
import WizSingletonWebView, { addWebViewEventHandler, injectJavaScript, endEditing, setFocus } from './WizSingletonWebView';
import { TOOLBAR_HEIGHT } from './EditorToolbar';

addWebViewEventHandler('onMessage', async (eventBody) => {
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
    console.debug(parts);
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
    // const old = await api.getNoteMarkdown(kbGuid, noteGuid);
    // if (old !== markdown) {
    //   console.log(old);
    //   console.log(markdown);
    // }
    //
    api.setNoteMarkdown(userGuid, kbGuid, noteGuid, markdown);
  } else if (name === 'keyDown') {
    // do nothing
  } else if (name === 'dropFile') {
    // do nothing
  } else {
    console.error(`unknown browser event: ${eventBody}`);
  }
});

export async function emptyEditor() {
  const dataText = JSON.stringify({
    contentId: '',
    markdown: '',
    resourceUrl: '',
  });
  const js = `window.loadMarkdown(${dataText});true;`;
  try {
    await injectJavaScript(js);
  } catch (err) {
    //
  }
}

export async function loadNote(note, isNewNote) {
  if (!note) {
    return;
  }

  if (isTablet()) {
    endEditing();
  }

  //
  let markdown = note.markdown;
  if (!note.markdown) {
    markdown = await api.getNoteMarkdown(note.kbGuid, note.guid);
  }

  console.log(`load note: ${isNewNote ? '(new note), ' : ''}${note.kbGuid}/${note.guid}`);
  const data = {
    markdown,
    resourceUrl: getResourceBaseUrl(api.userGuid, note.kbGuid, note.guid),
    contentId: `${api.userGuid}/${note.kbGuid}/${note.guid}`,
    isNewNote,
  };
  const dataText = JSON.stringify(data);
  if (isNewNote && isTablet()) {
    setFocus();
  }
  const js = `window.loadMarkdown(${dataText});true;`;
  await injectJavaScript(js);
}

const NoteEditor = React.forwardRef((props, ref) => {
  //
  //
  useImperativeHandle(ref, () => ({
    injectJavaScript: async (js) => {
      const result = await injectJavaScript(js);
      return result;
    },
    executeCommand: async (command) => {
      const js = `window.executeEditorCommand('${command}')`;
      try {
        const result = await injectJavaScript(js);
        return result;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  }));
  //
  // 清空编辑器，可以强制进行保存
  useEffect(() => emptyEditor, []);
  const keyboardVisibleTimeRef = useRef(0);
  const keyboardVisibleRef = useRef(false);
  const contentOffsetYRef = useRef(0);
  const scrollDownRef = useRef();

  function handleBeginScroll({ nativeEvent }) {
    const contentOffsetY = nativeEvent.contentOffset.y;
    contentOffsetYRef.current = contentOffsetY;
    scrollDownRef.current = undefined;
  }

  function handleScroll({ nativeEvent }) {
    let scrollDown = false;
    // console.log(nativeEvent);
    if (nativeEvent.scrollDown !== undefined) {
      scrollDown = nativeEvent.scrollDown;
    } else {
      const oldContentOffsetY = contentOffsetYRef.current;
      const contentOffsetY = nativeEvent.contentOffset.y;
      contentOffsetYRef.current = contentOffsetY;
      scrollDown = contentOffsetY < oldContentOffsetY;
    }
    if (keyboardVisibleRef.current && scrollDownRef.current === undefined) {
      if (scrollDown) {
        scrollDownRef.current = true;
        const now = new Date().valueOf();
        if (now - keyboardVisibleTimeRef.current > 1000) {
          console.debug('scroll down, hide keyboard');
          // 使用endEditing。在点击页面的时候可能会不正常跳动
          // endEditing(true);
          injectJavaScript('document.activeElement.blur();true;');
        }
      } else {
        scrollDownRef.current = false;
      }
    }
  }

  async function handleKeyboardShow({ nativeEvent }) {
    const { keyboardWidth, keyboardHeight } = nativeEvent;
    try {
      const js = `window.onKeyboardShow(${keyboardWidth}, ${keyboardHeight}, ${TOOLBAR_HEIGHT});true;`;
      await injectJavaScript(js);
    } catch (err) {
      console.log(err);
    }
    keyboardVisibleRef.current = true;
    keyboardVisibleTimeRef.current = new Date().valueOf();
    if (props.onBeginEditing) {
      props.onBeginEditing(nativeEvent);
    }
  }

  async function handleKeyboardHide({ nativeEvent }) {
    try {
      await injectJavaScript('window.onKeyboardHide();true;');
    } catch (err) {
      console.log(err);
    }
    keyboardVisibleRef.current = false;
    if (props.onEndEditing) {
      props.onEndEditing(nativeEvent);
    }
  }

  async function handleDropFile(messageData) {
    try {
      const { type, data } = messageData;
      console.debug(`drop file: ${type}`);
      if (!type.startsWith('image/')) {
        console.log(`unknown file type: ${type}`);
        return;
      }
      //
      const resourceUrl = await api.addImageFromData(note.kbGuid, note.guid, data, {
        base64: true,
        type: {
          ext: type.substr(6),
          mime: type,
        },
      });
      //
      const js = `window.addImage('${resourceUrl}');true;`;
      try {
        await injectJavaScript(js);
      } catch (err) {
        console.log(err.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleInsertImage(cb) {
    // select image from image picker
    function selectImage() {
      return new Promise((resolve, reject) => {
        //
        const options = {
          title: i18n.t('titleSelectImage'),
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        ImagePicker.showImagePicker(options, async (response) => {
          if (response.didCancel) {
            reject(new Error('User cancelled image picker'));
          } else if (response.error) {
            reject(new Error(`ImagePicker Error: ${response.error?.message}`));
          } else if (response.customButton) {
            reject(new Error(`User tapped custom button: ${response.customButton}`));
          } else {
            //
            const type = response.type;
            const orgWidth = response.width;
            const orgHeight = response.height;
            const ext = type.substr(type.indexOf('/') + 1);
            console.debug(`image file size: ${response.fileSize}, type: ${type}, ext: ${ext}`);
            console.debug(`image width: ${orgWidth}, height: ${orgHeight}`);
            //
            let resourceUrl;
            if (response.uri) {
              resourceUrl = response.uri;
            } else if (response.data) {
              //
              const rand = `${new Date().valueOf()}.${ext}`;
              const tempFileName = app.pathJoin(app.getPath('temp'), rand);
              await fs.writeFile(tempFileName, response.data, {
                base64: true,
              });
              resourceUrl = `file://${tempFileName}`;
            }
            //
            const MAX_SIZE = 1200;
            if (orgWidth > MAX_SIZE && orgHeight > MAX_SIZE) {
              //
              const rate = Math.min(orgWidth, orgHeight) / MAX_SIZE;
              const newWidth = orgWidth / rate;
              const newHeight = orgHeight / rate;
              //
              const newImage = await ImageResizer.createResizedImage(resourceUrl,
                newWidth, newHeight, ext.toUpperCase(), 90);
              resourceUrl = newImage.uri;
              console.debug(`new image file size: ${newImage.size}`);
            }
            //
            resourceUrl = await api.addImageFromUrl(note.kbGuid, note.guid, resourceUrl);
            //
            if (resourceUrl) {
              resolve(resourceUrl);
            } else {
              reject();
            }
          }
        });
      });
    }

    try {
      const resourceUrl = await selectImage();
      await injectJavaScript(`window.${cb}('${resourceUrl}');true;`);
    } catch (e) {
      console.error(e);
    }
  }

  function handleMessage({ nativeEvent }) {
    const data = JSON.parse(nativeEvent.body);
    const name = data.event;
    if (name === 'keyDown') {
      keyboardVisibleTimeRef.current = new Date().valueOf();
    } else if (name === 'dropFile') {
      handleDropFile(data);
    } else if (name === 'selectionChanged') {
      props.onChangeSelection(data);
    } else if (name === 'insertImage') {
      handleInsertImage(data.callback);
    }
  }

  const note = props[KEYS.CURRENT_NOTE];

  useEffect(() => {
    if (isTablet() && note) {
      const now = new Date().valueOf();
      const isNewNote = now - (new Date(note.created).valueOf()) < 5000;
      loadNote(note, isNewNote);
    }
  }, [note]);

  return (
    <View style={props.containerStyle}>
      <WizSingletonWebView
        onBeginScroll={handleBeginScroll}
        onScroll={handleScroll}
        onKeyboardShow={handleKeyboardShow}
        onKeyboardHide={handleKeyboardHide}
        onMessage={handleMessage}
        style={props.editorStyle}
      />
    </View>
  );
});

export default connect([
  KEYS.CURRENT_KB,
  KEYS.CURRENT_NOTE,
])(NoteEditor);
