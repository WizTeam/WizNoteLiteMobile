import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';

// eslint-disable-next-line import/no-unresolved
import { MarkdownEditor, useEditor } from 'wiz-react-markdown-editor';

import './App.css';
import { addExecuteEditorCommandListener } from './executeEditorCommand';

const PhoneTheme = React.lazy(() => import('./PhoneTheme'));
const PadTheme = React.lazy(() => import('./PadTheme'));

const params = queryString.parse(window.location.search);
const isTablet = params.isTablet === 'true';
let timer = 0;

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
  //
  const editorRef = useRef(null);

  const { isCursorInTable } = useEditor(editorRef);
  //
  useEffect(() => {
    window.loadMarkdown = (options) => {
      const { markdown, resourceUrl, contentId, isNewNote } = options;
      setData({
        markdown,
        resourceUrl,
        contentId,
      });
      if (isNewNote) {
        setTimeout(() => {
          editorRef.current.focus();
          editorRef.current.selectFirstTitle();
        }, 500);
      }
      return true;
    };
    //
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
      console.log('onKeyboardHide');
      setBottomHeight(0);
      return true;
    };
    //
    window.addImage = (url) => {
      console.log(`request add image: ${url}`);
      editorRef.current.resetCursor();
      editorRef.current.insertImage({ src: url });
      return true;
    };
    //
    window.ondrop = async (event) => {
      console.log('on drop');
      const files = event.dataTransfer.files;
      const count = files.length;
      if (count === 0) {
        return;
      }
      event.preventDefault();
      //
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
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
    //
    setTimeout(() => {
      function insertImage(imageInfo) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          editorRef.current.saveCursor();
          //
          const callback = `insertImage${new Date().getTime()}`;
          window[callback] = (url) => {
            editorRef.current.resetCursor();
            if (imageInfo) {
              editorRef.current.replaceImage(imageInfo, { src: url });
            } else {
              editorRef.current.insertImage({ src: url });
            }
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
      addExecuteEditorCommandListener(editorRef.current, insertImage);
      editorRef.current.on('muya-image-selector', ({ imageInfo }) => insertImage(imageInfo));
    });
    //
  }, []);
  //
  useEffect(() => {
    //
    function handleKeyDown() {
      const messageData = {
        event: 'keyDown',
      };
      postMessage(JSON.stringify(messageData));
    }
    //
    document.body.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  //
  useEffect(() => {
    postMessage({
      event: 'selectionChanged',
      isCursorInTable,
    });
  }, [isCursorInTable]);
  //
  return (
    <div
      className="App"
      style={{
        visibility: (data && data.contentId) ? 'visible' : 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <React.Suspense fallback={<></>}>
        {(isTablet) && <PadTheme />}
        {(!isTablet) && <PhoneTheme />}
      </React.Suspense>
      <Editor
        editorRef={editorRef}
        contentId={data?.contentId}
        markdown={data?.markdown}
        resourceUrl={data?.resourceUrl}
        bottomHeight={bottomHeight}
      />
    </div>
  );
}

export default App;
