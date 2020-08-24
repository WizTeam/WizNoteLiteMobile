import React, { useEffect, useState } from 'react';
import queryString from 'query-string';

import MarkdownEditor from 'wiz-react-markdown-editor';

import 'wiz-react-markdown-editor/lib/index.min.css';
import './App.css';

const params = queryString.parse(window.location.search);

function Editor(props) {
  //
  function handleSave({contentId, content}) {
    //
    const messageData = JSON.stringify({
      event: 'saveData',
      contentId,
      markdown: content.markdown,
    });
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(messageData);
    } else {
      console.log(`request save data: contentId=${contentId}`);
    }
  }
  //
  const theme = params.theme || 'lite';
  //
  let markdown = props.markdown || '';
  // markdown = markdown.replace(new RegExp('index_files/', 'g'), `${props.resourceUrl}/index_files/`);

  return (
    <MarkdownEditor
      theme={theme}
      onSave={handleSave}
      markdown={markdown}
      resourceUrl={props.resourceUrl}
    />
  );
}

function App() {
  //
  const [data, setData] = useState(null);
  //
  useEffect(() => {
    window.loadMarkdown = ({markdown, resourceUrl, contentId}) => {
      setData({
        markdown,
        resourceUrl,
        contentId,
      });
    }
  });
  //
  const style = {
    visibility: data ? 'visible' : 'hidden',
  };
  //
  return (
    <div className="App">
      <Editor
        style={style}
        contentId={data?.contentId}
        markdown={data?.markdown}
        resourceUrl={data?.resourceUrl}  
      />
    </div>
  );
}

export default App;
