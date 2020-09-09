import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import MarkdownEditor from 'wiz-react-markdown-editor';

import 'wiz-react-markdown-editor/lib/index.min.css';
import './App.css';
import ThemeSwitcher from './ThemeSwitch';
import Toolbar from './Toolbar';
const useStyles = makeStyles({
  editorWrapper: {
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

function Editor(props) {
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
  //
  useEffect(() => {
    window.loadMarkdown = (options) => {
      const {markdown, resourceUrl, contentId} = options;
      setData({
        markdown,
        resourceUrl,
        contentId,
      });
    }
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
        flexDirection: 'column',
      }}>
        <Editor
          contentId={data?.contentId}
          markdown={data?.markdown}
          resourceUrl={data?.resourceUrl}  
        />
        <Toolbar />
      </div>
    </ThemeSwitcher>
  );
}

export default App;
