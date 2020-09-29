import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

import { getResourceBaseUrl } from '../services/resources_loader';
import { KEYS, connect } from '../data_store';
import api from '../api';
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
  function handleMessage({ nativeEvent }) {
    const data = JSON.parse(nativeEvent.body);
    const name = data.event;
    if (name === 'keyDown') {
      keyboardVisibleTimeRef.current = new Date().valueOf();
    } else if (name === 'dropFile') {
      handleDropFile(data);
    } else if (name === 'isCursorInTable') {
      props.changeCursorStatus(data.value);
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
