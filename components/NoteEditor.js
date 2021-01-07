import React, { useEffect, useRef, useImperativeHandle, useCallback } from 'react';
import { View, Linking, Appearance } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import i18n from 'i18n-js';

import { getResourceBaseUrl } from '../services/resources_loader';
import store, { KEYS, connect } from '../data_store';
import api from '../api';
import app from '../wrapper/app';
import fs from '../wrapper/fs';
import { openNoteLinksScreen } from '../services/navigation';
import { isTablet, setKeyboardHeight } from '../utils/device';
import WizSingletonWebView, { addWebViewEventHandler, injectJavaScript, endEditing, setFocus } from './WizSingletonWebView';
import { TOOLBAR_HEIGHT } from './EditorToolbar';
import { Navigation } from '../thirdparty/react-native-navigation';
import { showDrawer } from './NoteInfoDrawer';

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
  } else if (name === 'openLink') {
    if (data.url && data.url.startsWith('http')) {
      try {
        Linking.openURL(data.url).catch(() => {});
      } catch (err) {
        // ignore error
      }
    }
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
    openNoteInfoDrawer,
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
      setKeyboardHeight(keyboardHeight);
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
      setKeyboardHeight(0);
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

  async function openNote(content) {
    if (typeof content === 'string') {
      const title = content.trim();
      if (title) {
        const kbGuid = store.getCurrentKb();
        const list = await api.searchNotesForTitle(kbGuid, title);
        if (!list?.length) {
          console.log('createNote');
          const note = await api.createNote(kbGuid, { type: 'lite/markdown', markdown: `# ${title}` });
          store.setCurrentNote(note);
          loadNote(note, false);
          if (store.getSelectedType() !== '#allNotes') {
            store.setSelectedType('#allNotes');
          }
        // } else if (list.length === 1) {
        //   this.handler.handleSelectNote(list[0].guid);
        } else {
          store.setCurrentNote(list[0]);
          loadNote(list[0], false);
        }
      }
    } else if (content.guid) {
      const kbGuid = store.getCurrentKb();
      const note = await api.getNote(kbGuid, content.guid);
      store.setCurrentNote(note);
      loadNote(note, false);
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
    } else if (name === 'insertNoteLink') {
      openNoteLinksScreen({
        onSelect: (content) => injectJavaScript(`window.${data.callback}(${content === undefined ? content : `'${content}'`});true;`),
      });
    } else if (name === 'noteLink') {
      openNote(data.title);
    }
  }

  const note = props[KEYS.CURRENT_NOTE];

  const settingInfo = props[KEYS.USER_SETTING] || {};

  const isDark = Appearance.getColorScheme() === 'dark';

  async function checkTheme() {
    if (isDark !== undefined) {
      const newTheme = [];
      //
      if (settingInfo.colorTheme) {
        newTheme.push(settingInfo.colorTheme);
      }
      if (isDark) {
        newTheme.push('dark');
      } else {
        newTheme.push('lite');
      }
      //
      const css = await api.getThemeCssString(newTheme.join('.'));
      await injectJavaScript(`checkTheme(${JSON.stringify(css)});true;`);
    }
  }

  useEffect(() => {
    setTimeout(() => { checkTheme(); }, 500);
  }, [isDark, settingInfo.colorTheme]);

  useEffect(() => {
    if (isTablet() && note) {
      const now = new Date().valueOf();
      const isNewNote = now - (new Date(note.created).valueOf()) < 5000;
      loadNote(note, isNewNote);
    }
  }, [note]);

  async function getTOC() {
    const toc = await injectJavaScript('window.getNoteToc()');
    if (toc) {
      const list = toc.map((item) => ({
        ...item,
        name: item.content,
        key: item.slug,
        id: item.slug,
        children: [],
        open: true,
      }));

      const result = [];
      const parent = new Map();
      let last = null;

      parent.set(last, { lvl: 0, children: result });

      list.forEach((item) => {
        while (!last || item.lvl <= last.lvl) {
          last = parent.get(last);
        }
        last.children.push(item);
        parent.set(item, last);
        last = item;
      });
      return result;
    }
    return [];
  }

  async function getLinkList() {
    const list = await injectJavaScript('window.getNoteLinks()');
    return list;
  }

  async function noteScrollByKey(key) {
    await injectJavaScript(`window.noteScrollByKey('${key}')`);
  }
  const openNoteInfoDrawer = useCallback(async () => {
    const toc = await getTOC();
    const linksList = await getLinkList();
    const backwardLinkedNotes = await api.getBackwardLinkedNotes(note.kbGuid, note.title);
    console.log('backwardLinkedNotes', backwardLinkedNotes);
    showDrawer(props.componentId, {
      toc,
      noteScrollByKey,
      linksList,
      openNote,
      noteTitle: note.title,
      backwardLinkedNotes,
    });
  }, [note]);

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(
      async ({ buttonId }) => {
        if (buttonId === 'noteInfoDrawer') {
          openNoteInfoDrawer();
        }
      },
    );
    return () => listener.remove();
  }, [openNoteInfoDrawer]);

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
  KEYS.USER_SETTING,
])(NoteEditor);
