import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

import { getResourceBaseUrl } from '../services/resources_loader';
import { KEYS, connect } from '../data_store';
import api from '../api';
import { isTablet } from '../utils/device';
import WizSingletonWebView, { addWebViewEventHandler, injectJavaScript, endEditing } from './WizSingletonWebView';

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
    // const old = await api.getNoteMarkdown(kbGuid, noteGuid);
    // if (old !== markdown) {
    //   console.log(old);
    //   console.log(markdown);
    // }
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

export async function loadNote(note) {
  if (!note) {
    return;
  }

  if (isTablet) {
    endEditing();
  }

  //
  let markdown = note.markdown;
  if (!note.markdown) {
    markdown = await api.getNoteMarkdown(note.kbGuid, note.guid);
  }

  console.log(`load note: ${note.kbGuid}/${note.guid}`);
  const data = {
    markdown,
    resourceUrl: getResourceBaseUrl(api.userGuid, note.kbGuid, note.guid),
    contentId: `${api.userGuid}/${note.kbGuid}/${note.guid}`,
  };
  const dataText = JSON.stringify(data);
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
    const oldContentOffsetY = contentOffsetYRef.current;
    const contentOffsetY = nativeEvent.contentOffset.y;
    contentOffsetYRef.current = contentOffsetY;
    if (keyboardVisibleRef.current && scrollDownRef.current === undefined) {
      if (contentOffsetY < oldContentOffsetY) {
        scrollDownRef.current = true;
        const now = new Date().valueOf();
        if (now - keyboardVisibleTimeRef.current > 1000) {
          // 使用endEditing。在点击页面的时候可能会不正常跳动
          // endEditing(true);
          injectJavaScript('document.activeElement.blur();true;');
        }
      }
    }
  }

  async function handleKeyboardShow({ nativeEvent }) {
    try {
      const { keyboardWidth, keyboardHeight } = nativeEvent;
      const js = `window.onKeyboardShow(${keyboardWidth}, ${keyboardHeight});true;`;
      await injectJavaScript(js);
    } catch (err) {
      console.log(err);
    }
    keyboardVisibleRef.current = true;
    keyboardVisibleTimeRef.current = new Date().valueOf();
    if (props.onBeginEditing) {
      props.onBeginEditing();
    }
  }

  async function handleKeyboardHide() {
    try {
      await injectJavaScript('window.onKeyboardHide();true;');
    } catch (err) {
      console.log(err);
    }
    keyboardVisibleRef.current = false;
    if (props.onEndEditing) {
      props.onEndEditing();
    }
  }

  function handleMessage({ nativeEvent }) {
    const data = JSON.parse(nativeEvent.body);
    const name = data.event;
    if (name === 'onKeyDown') {
      keyboardVisibleTimeRef.current = new Date().valueOf();
    }
  }

  const note = props[KEYS.CURRENT_NOTE];

  useEffect(() => {
    loadNote(note);
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
