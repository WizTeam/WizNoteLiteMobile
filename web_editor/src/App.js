import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';

// eslint-disable-next-line import/no-unresolved
import { MarkdownEditor, useEditor } from 'wiz-react-markdown-editor';

import './App.css';
import axios from 'axios';
import {
  createEditorPromise,
  markdown2Doc,
  LANGS,
  blockUtils,
  BLOCK_TYPE,
  domUtils,
// } from './live-editor/client';
} from 'live-editor/client';
import { addExecuteEditorCommandListener } from './executeEditorCommand';
import { injectionCssFormId, overwriteEditorConfig } from './utils';

// eslint-disable-next-line import/no-extraneous-dependencies
const { extractLinksFromMarkdown } = require('wiznote-sdk-js-share').noteAnalysis;

const containerId = `wiz-note-content-root-${new Date().getTime()}`;

const PhoneTheme = React.lazy(() => import('./PhoneTheme'));
const PadTheme = React.lazy(() => import('./PadTheme'));

const params = queryString.parse(window.location.search);
const isTablet = params.isTablet === 'true';
let timer = 0;

let docToc = [];
let docLinks = [];

async function downloadImageToFile(src) {
  try {
    const res = await axios.get(src, {
      responseType: 'blob',
    });
    //
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      //
      reader.onload = resolve;
      reader.onerror = reject;
      //
    });

    reader.readAsArrayBuffer(res.data);
    //
    await promise;
    //
    const buffer = reader.result;
    return buffer;
  } catch (err) {
    return null;
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const useStyles = makeStyles({
  editorWrapper: {
  },
  editorComponent: {
    overflowX: 'hidden !important',
    maxWidth: '100%',
  },
});

function postMessage(messageData) {
  if (typeof messageData !== 'string') {
    // eslint-disable-next-line no-param-reassign
    messageData = JSON.stringify(messageData);
  }
  if (window.WizWebView) {
    window.WizWebView.postMessage(messageData);
  } else if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(messageData);
  } else {
    console.error('unknown browser');
  }
}

function Editor(props) {
  //
  const classes = useStyles();
  //
  function handleSave({ contentId, markdown }) {
    //
    // console.log('request save data')
    const messageData = JSON.stringify({
      event: 'saveData',
      contentId,
      markdown,
    });
    postMessage(messageData);
  }
  //
  function handleOpenLink({ url }) {
    const messageData = JSON.stringify({
      event: 'openLink',
      url,
    });
    postMessage(messageData);
  }
  //
  const markdown = props.markdown || '';

  return (
    <MarkdownEditor
      ref={props.editorRef}
      style={props.style}
      onSave={handleSave}
      onLinkOpen={handleOpenLink}
      markdown={markdown}
      resourceUrl={props.resourceUrl}
      contentId={props.contentId}
      editorWrapperClassName={classes.editorWrapper}
      editorComponentClassName={classes.editorComponent}
      bottomHeight={props.bottomHeight}
    />
  );
}

function App() {
  //
  const [data, setData] = useState(null);
  const [bottomHeight, setBottomHeight] = useState(100);
  const [focusNode, setFocusNode] = useState();
  //
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  // const { isCursorInTable } = useEditor(editorRef);
  //
  // useEffect(() => {
  //   window.loadMarkdown = (options) => {
  //     const { markdown, resourceUrl, contentId, isNewNote } = options;
  //     setData({
  //       markdown,
  //       resourceUrl,
  //       contentId,
  //     });
  //     if (isNewNote) {
  //       setTimeout(() => {
  //         editorRef.current.focus();
  //         editorRef.current.selectFirstTitle();
  //       }, 500);
  //     }
  //     return true;
  //   };
  //   //
  //   window.onKeyboardShow = (keyboardWidth, keyboardHeight, toolbarHeight) => {
  //     if (/(?:Android)/.test(window.navigator.userAgent)) {
  //       setBottomHeight(toolbarHeight);
  //     } else {
  //       setBottomHeight(keyboardHeight + toolbarHeight + 50);
  //     }

  //     // setBottomHeight(312);
  //     return true;
  //   };
  //   //
  //   window.onKeyboardHide = () => {
  //     console.log('onKeyboardHide');
  //     setBottomHeight(0);
  //     return true;
  //   };
  //   //
  //   window.addImage = (url) => {
  //     console.log(`request add image: ${url}`);
  //     editorRef.current.resetCursor();
  //     editorRef.current.insertImage({ src: url });
  //     return true;
  //   };
  //   //
  //   window.ondrop = async (event) => {
  //     console.log('on drop');
  //     const files = event.dataTransfer.files;
  //     const count = files.length;
  //     if (count === 0) {
  //       return;
  //     }
  //     event.preventDefault();
  //     //
  //     const toBase64 = (file) => new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = (error) => reject(error);
  //     });
  //     //
  //     for (let i = 0; i < count; i++) {
  //       const f = files[i];
  //       const type = f.type;
  //       const name = f.name;
  //       try {
  //         const base64DataUrl = await toBase64(f);
  //         const base64Data = base64DataUrl.split(',')[1];
  //         const message = {
  //           event: 'dropFile',
  //           data: base64Data,
  //           name,
  //           type,
  //           index: i,
  //           totalCount: count,
  //         };
  //         postMessage(message);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   };

  //   window.getNoteToc = () => editorRef.current.getTOC();

  //   window.getNoteLinks = () => editorRef.current.getNoteLinks();

  //   window.noteScrollByKey = (key) => {
  //     const element = document.querySelector(`#${key}`);
  //     element.scrollIntoView({
  //       behavior: 'smooth',
  //     });
  //   };

  //   window.checkTheme = (css) => {
  //     const id = 'wiz-note-content-root';
  //     const reg = new RegExp(id, 'g');
  //     injectionCssFormId(containerId, css.replace(reg, containerId));
  //   };

  //   window.setEditorTextStyle = (options) => {
  //     if (options) {
  //       overwriteEditorConfig(options);
  //       // console.log(options);
  //     }
  //   };
  //   //
  //   setTimeout(() => {
  //     function insertImage(imageInfo) {
  //       if (timer) {
  //         clearTimeout(timer);
  //       }
  //       timer = setTimeout(() => {
  //         editorRef.current.saveCursor();
  //         //
  //         const callback = `insertImage${new Date().getTime()}`;
  //         window[callback] = (url) => {
  //           editorRef.current.resetCursor();
  //           if (imageInfo) {
  //             editorRef.current.replaceImage(imageInfo, { src: url });
  //           } else {
  //             editorRef.current.insertImage({ src: url });
  //           }
  //           window[callback] = undefined;
  //         };
  //         //
  //         postMessage({
  //           event: 'insertImage',
  //           callback,
  //         });
  //         timer = null;
  //       }, 500);
  //     }
  //     function insertNoteLink() {
  //       const selection = document.getSelection();
  //       const range = selection.getRangeAt(0);
  //       if (range.collapsed) {
  //         timer = setTimeout(() => {
  //           editorRef.current.saveCursor();
  //           //
  //           const callback = `insertNoteLink${new Date().getTime()}`;
  //           window[callback] = (content) => {
  //             editorRef.current.resetCursor();
  //             if (content !== undefined) {
  //               editorRef.current.insertNoteLink(content);
  //             }
  //             window[callback] = undefined;
  //           };
  //           //
  //           postMessage({
  //             event: 'insertNoteLink',
  //             callback,
  //           });
  //           timer = null;
  //         }, 500);
  //       } else {
  //         editorRef.current.insertNoteLink();
  //       }
  //     }
  //     addExecuteEditorCommandListener(editorRef.current, insertImage, insertNoteLink);
  //     editorRef.current.on('muya-image-selector', ({ imageInfo }) => insertImage(imageInfo));
  //   });
  // }, []);
  //
  // useEffect(() => {
  //   //
  //   function handleKeyDown() {
  //     const messageData = {
  //       event: 'keyDown',
  //     };
  //     postMessage(JSON.stringify(messageData));
  //   }

  //   function onNoteLink({ href: title }) {
  //     postMessage({
  //       event: 'noteLink',
  //       title,
  //     });
  //   }
  //   //
  //   document.body.addEventListener('keydown', handleKeyDown);
  //   editorRef.current.on('muya-note-link', onNoteLink);
  //   return () => {
  //     document.body.removeEventListener('keydown', handleKeyDown);
  //     editorRef.current.off('muya-note-link', onNoteLink);
  //   };
  // }, []);

  // useEffect(() => {
  //   postMessage({
  //     event: 'selectionChanged',
  //     isCursorInTable,
  //   });
  // }, [isCursorInTable]);

  const scrollView = useCallback((node) => {
    const rect = node.getBoundingClientRect();
    const scrollContainer = document.documentElement;
    if (window.outerHeight - bottomHeight < rect.bottom) {
      const editableHeight = rect.bottom - window.outerHeight + bottomHeight;
      //
      if (editableHeight > 1) {
        domUtils.animatedScrollTo(scrollContainer, scrollContainer.scrollTop + editableHeight, 100);
      }
    } else if (rect.top < 0) {
      const editableHeight = rect.top;
      //
      domUtils.animatedScrollTo(scrollContainer, scrollContainer.scrollTop - editableHeight, 100);
    }
  }, [bottomHeight]);

  const handleBuildResourceUrl = useCallback((editor, resourceName) => {
    if (data?.resourceUrl && resourceName.startsWith('index_files/')) {
      return `${data.resourceUrl}/${resourceName}`;
    }
    return resourceName;
  }, [data]);

  const loadNote = useCallback(async (initLocalData, kbGuid, guid, user, contentId, allNotesTitle) => {
    const langs = {
      'zh-CN': LANGS.ZH_CN,
      'zh-SG': LANGS.ZH_CN,
      'zh-HK': LANGS.ZH_TW,
      'zh-TW': LANGS.ZH_TW,
      'zh-MO': LANGS.ZH_TW,
      en: LANGS.EN_US,
    };

    function handleLiveEditorChange(editor) {
      const markdown = editor.toMarkdown();
      docLinks = extractLinksFromMarkdown(markdown) ?? [];
      const messageData = JSON.stringify({
        event: 'saveData',
        contentId,
        markdown,
      });
      postMessage(messageData);
    }

    async function handleUploadResource(editor, file) {
      const base64DataUrl = await toBase64(file);
      const base64Data = base64DataUrl.split(',')[1];
      return new Promise((resolve) => {
        const callback = `uploadResource${new Date().getTime()}`;
        window[callback] = (url) => {
          resolve(url);
          window[callback] = undefined;
        };
        const messageData = JSON.stringify({
          event: 'uploadResource',
          type: file.type,
          data: base64Data,
          callback,
        });
        postMessage(messageData);
      });
    }

    async function handleCopyResourcesFromOtherServer(editor, apiServer, resourceNames, token) {
      //
      const getNoteInfoFromApiServer = () => {
        //
        const find = 'localhost-lite/';
        const index = apiServer.indexOf(find);
        if (index === -1) {
          return [];
        }
        const last = apiServer.substr(index + find.length);
        const parts = last.split('/');
        const noteKbGuid = parts[0];
        const noteGuid = parts[1];
        //
        return [noteKbGuid, noteGuid];
      };
      // from
      const [fromKbGuid, fromNoteGuid] = getNoteInfoFromApiServer(apiServer);
      //
      // 从其他编辑服务复制
      if (!fromKbGuid || !fromNoteGuid) {
        //
        const ret = {};
        const promises = resourceNames.map(async (resName) => {
          try {
            const url = resName.startsWith('http') ? resName : `${apiServer}/resources/${encodeURIComponent(resName)}?token=${token}`;
            const file = await downloadImageToFile(url);
            if (file) {
              return file;
            }
          } catch (err) {
            console.error(err);
          }
          return null;
        });
        //
        await Promise.all(promises);
        return ret;
      }
      //
      const userGuid = window.wizApi?.userManager?.userGuid || '';
      const ret = {};

      const promises = resourceNames.map(async (resName) => {
        try {
          const url = `wiz://${userGuid}/${fromKbGuid}/${fromNoteGuid}/${resName}`;
          const file = await downloadImageToFile(url);
          if (file) {
            const newResourceName = await handleUploadResource(editor, file);
            ret[resName] = newResourceName;
            return file;
          }
        } catch (err) {
          console.error(err);
        }
        return null;
      });
      //
      await Promise.all(promises);
      return ret;
    }

    function insertImage(editor, container, index) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        //
        const callback = `insertImage${new Date().getTime()}`;
        window[callback] = (url) => {
          editor.insertImage(container, handleBuildResourceUrl(editor, url), index);
          window[callback] = undefined;
        };
        //
        postMessage({
          event: 'insertImage',
          callback,
        });
        timer = null;
      }, 500);
    }
    function handleUpdateToc(editor, toc) {
      docToc = toc ?? [];
    }

    function handleBlockFocusChanged(editor, block, focused) {
      if (focused) {
        if (blockUtils.getBlockType(block) === BLOCK_TYPE.TABLE) {
          postMessage({
            event: 'selectionChanged',
            isCursorInTable: true,
          });
        } else {
          postMessage({
            event: 'selectionChanged',
            isCursorInTable: false,
          });
        }
      }
    }
    function handleScrollIntoView(editor, scrollContainer, dom) {
      scrollView(dom);
      setFocusNode(dom);
    }

    function getWikiLinks(editor, keywords) {
      if (keywords) {
        return allNotesTitle;
      }
      return allNotesTitle.filter((link) => link.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
    }

    // const lang = langs[this.props.intl.local] || LANGS.EN_US;

    const auth = {
      appId: 'WizNoeLite',
      userId: '',
      permission: 'w',
      docId: `${kbGuid}-${guid}`,
      token: '',
      displayName: user.displayName,
      avatarUrl: user.avatarUrl ?? 'https://live-editor.com/wp-content/new-uploads/a0919cb4-d3c2-4027-b64d-35a4c2dc8e23.png',
    };
    const options = {
      serverUrl: `ws://localhost-lite/${kbGuid}/${guid}`,
      // lang,
      local: true,
      initLocalData,
      placeholder: 'Please enter document title',
      markdownOnly: true,
      lineNumber: false,
      titleInEditor: true,
      hideComments: true,
      isMobile: true,
      resourceProtocol: ['wiz:'],
      callbacks: {
        // onLoad: this.handler.handleCheckMode,
        // onError: this.handler.handleError,
        onChange: handleLiveEditorChange,
        onUploadResource: handleUploadResource,
        onBuildResourceUrl: handleBuildResourceUrl,
        onCopyResourcesFromOtherServer: handleCopyResourcesFromOtherServer,
        onUpdateToc: handleUpdateToc,
        onSelectFileUpload: insertImage,
        onBlockFocusChanged: handleBlockFocusChanged,
        onScrollIntoView: handleScrollIntoView,
        onGetWikiLinkItems: getWikiLinks,
        // onFileInserted: () => console.log('onFileInserted'),
        // onGetTagItems: this.handler.handleGetTagItems,
        // onTagClicked: this.handler.handleTagClicked,
      },
    };
    editorRef.current = await createEditorPromise(containerRef.current, options, auth);
    addExecuteEditorCommandListener(editorRef.current, () => {
      insertImage(editorRef.current, null, -2);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleBuildResourceUrl, scrollView]);

  useEffect(() => {
    window.loadMarkdown = (options) => {
      setData(options);
      if (options.kbGuid && options.guid) {
        const doc = markdown2Doc(options.markdown);
        loadNote(doc, options.kbGuid, options.guid, options.user, options.contentId, options.allNotesTitle ?? []);
      }
    };
    window.getNoteToc = () => docToc;
    window.getNoteLinks = () => docLinks;
    window.onKeyboardShow = (keyboardWidth, keyboardHeight, toolbarHeight) => {
      if (/(?:Android)/.test(window.navigator.userAgent)) {
        setBottomHeight(toolbarHeight);
      } else {
        setBottomHeight(keyboardHeight + toolbarHeight + 50);
      }

      // setBottomHeight(312);
      return true;
    };
    //
    window.onKeyboardHide = () => {
      setBottomHeight(0);
      return true;
    };
    window.addImage = (url) => {
      console.log(`request add image: ${url}`);
      editorRef.current.insertImage(null, handleBuildResourceUrl(editorRef.current, url), -2);
      return true;
    };
    window.ondrop = async (event) => {
      console.log('on drop');
      const files = event.dataTransfer.files;
      const count = files.length;
      if (count === 0) {
        return;
      }
      event.preventDefault();
      //
      for (let i = 0; i < count; i++) {
        const f = files[i];
        const type = f.type;
        const name = f.name;
        try {
          const base64DataUrl = await toBase64(f);
          const base64Data = base64DataUrl.split(',')[1];
          const message = {
            event: 'dropFile',
            data: base64Data,
            name,
            type,
            index: i,
            totalCount: count,
          };
          postMessage(message);
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.checkTheme = (css) => {
      const id = 'wiz-note-content-root';
      const reg = new RegExp(id, 'g');
      injectionCssFormId(containerId, css.replace(reg, containerId));
    };
    window.setEditorTextStyle = (options) => {
      if (options) {
        overwriteEditorConfig(options);
        // console.log(options);
      }
    };
    console.log('editorRef');
  }, [handleBuildResourceUrl, loadNote]);

  useEffect(() => {
    if (focusNode) {
      scrollView(focusNode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomHeight]);
  //
  return (
    <div
      className="App editor-root"
      style={{
        // visibility: (data && data.contentId) ? 'visible' : 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      id={containerId}
    >
      <React.Suspense fallback={<></>}>
        {(isTablet) && <PadTheme />}
        {(!isTablet) && <PhoneTheme />}
      </React.Suspense>
      <div ref={containerRef} />
      {/* <Editor
        editorRef={editorRef}
        contentId={data?.contentId}
        markdown={data?.markdown}
        resourceUrl={data?.resourceUrl}
        bottomHeight={bottomHeight}
      /> */}
    </div>
  );
}

export default App;
