import React, { useEffect, useState } from 'react';
import queryString from 'query-string';

import MarkdownEditor from 'wiz-react-markdown-editor';

import 'wiz-react-markdown-editor/lib/index.min.css';
import './App.css';

const params = queryString.parse(window.location.search);

function Editor(props) {
  //
  function handleSave({contentId, markdown}) {
    //
    const messageData = JSON.stringify({
      event: 'saveData',
      contentId,
      markdown,
    });
    if (window.WizWebView) {
      window.WizWebView.postMessage(messageData);
    } else {
      console.log(`request save data: contentId=${contentId}`);
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
      theme={theme}
      onSave={handleSave}
      markdown={markdown}
      resourceUrl={props.resourceUrl}
      contentId={props.contentId}
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
  const style = {
    visibility: data ? 'visible' : 'hidden',
  };
  //
  return (
    <div className="App" style={{
      height: '100vh'
    }}>
      <Editor
        style={style}
        contentId={data?.contentId}
        markdown={data?.markdown}
        resourceUrl={data?.resourceUrl}  
        theme={data?.theme}
      />
    </div>
  );
}

export default App;
