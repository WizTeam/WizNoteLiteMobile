import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';

import { MarkdownEditor, useEditor } from 'wiz-react-markdown-editor';

import 'wiz-react-markdown-editor/lib/index.min.css';
import './App.css';
import ThemeSwitcher from './ThemeSwitch';
import Toolbar from './Toolbar';

const PhoneTheme = React.lazy(() => import('./PhoneTheme'));
const PadTheme = React.lazy(() => import('./PadTheme'));

const params = queryString.parse(window.location.search);
const isTablet = params.isTablet === 'true';

console.log(isTablet);

const useStyles = makeStyles({
  editorWrapper: {
    overflowY: 'scroll'
  },
  editorComponent: {
    overflowX: 'hidden !important',
    maxWidth: '100%',
  },
});

function postMessage(messageData) {
  if (window.WizWebView) {
    window.WizWebView.postMessage(messageData);
  } else if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(messageData);
  } else {
    console.error('unknown browser');
  }
}

const Editor = (props) => {
  //
  const classes = useStyles();
  //
  function handleSave({contentId, markdown}) {
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
  let markdown = props.markdown || '';

  return (
    <MarkdownEditor
      ref={props.editorRef}
      style={props.style}
      onSave={handleSave}
      markdown={markdown}
      resourceUrl={props.resourceUrl}
      contentId={props.contentId}
      editorWrapperClassName={classes.editorWrapper}
      editorComponentClassName={classes.editorComponent}
    />
  );
}

function App() {
  //
  const [data, setData] = useState(null);

  const editorRef = useRef(null);
  const { isCursorInTable } = useEditor(editorRef);

  const [showToolbar, setShowToolbar] = useState(false);
  //
  useEffect(() => {
    window.loadMarkdown = (options) => {
      const {markdown, resourceUrl, contentId} = options;
      setData({
        markdown,
        resourceUrl,
        contentId,
      });
      return true;
    };
    //
    window.onBeforeInsert = () => {
      console.log('onBeforeInsert');
      editorRef.current.saveCursor();
      return true;
    };
    //
    window.onKeyboardShow = (keyboardWidth, keyboardHeight) => {
      console.log('onKeyboardShow');
      return true;
    };
    //
    window.onKeyboardHide = () => {
      console.log('onKeyboardHide');
      setShowToolbar(false);
      return true;
    };
    //
    window.addImage = (url) => {
      // TODO: add image to editor
      console.log(`request add image: ${url}`);
      editorRef.current.resetCursor();
      editorRef.current.insertImage(url);
      return true;
    };
  }, []);
  //
  useEffect(() => {
    //
    function handleKeyDown() {
      const messageData = {
        event: 'onKeyDown',
      }
      postMessage(JSON.stringify(messageData));
    }
    //
    document.body.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    }

  }, []);
  //
  //
  return (
    <ThemeSwitcher>
      <div className="App" style={{
        visibility: (data && data.contentId) ? 'visible' : 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
        // position: 'fixed',
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0
      }}>
        <Editor
          editorRef={editorRef}
          contentId={data?.contentId}
          markdown={data?.markdown}
          resourceUrl={data?.resourceUrl}  
        />
        <Toolbar isCursorInTable={isCursorInTable} editor={editorRef.current} isShow={showToolbar} />
      </div>
    </ThemeSwitcher>
  );
}

export default App;
