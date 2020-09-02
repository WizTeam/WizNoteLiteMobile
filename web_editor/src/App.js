import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/core/styles';

import MarkdownEditor from 'wiz-react-markdown-editor';

import 'wiz-react-markdown-editor/lib/index.min.css';
import './App.css';

const params = queryString.parse(window.location.search);

const useStyles = makeStyles({
  editorWrapper: {
  },
  editorComponent: {
    overflowX: 'hidden !important',
    maxWidth: '100%',
  },
});

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
    if (window.WizWebView) {
      window.WizWebView.postMessage(messageData);
    } else if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(messageData);
    } else {
      console.error('unknown browser');
    }
  }
  //
  let theme = props.theme || params.theme;
  if (!theme) {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;
    const defaultTheme = isDarkMode ? 'dark' : 'light';
    theme = defaultTheme;
  }
  //
  let markdown = props.markdown || '';

  return (
    <MarkdownEditor
      style={props.style}
      theme={theme}
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
      const {markdown, resourceUrl, contentId, theme} = options;
      setData({
        markdown,
        resourceUrl,
        contentId,
        theme,
      });
    }
  });
  //
  //
  return (
    <div className="App" style={{
      height: '100vh',
      visibility: (data && data.contentId) ? 'visible' : 'hidden',
    }}>
      <Editor
        contentId={data?.contentId}
        markdown={data?.markdown}
        resourceUrl={data?.resourceUrl}  
        theme={data?.theme}
      />
    </div>
  );
}

export default App;
