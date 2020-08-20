import React, { useRef, useEffect, useState } from 'react';
import assert from 'assert';
import queryString from 'query-string';

import MarkdownEditor from 'wiz-react-markdown-editor';

import 'wiz-react-markdown-editor/lib/index.min.css';
import './App.css';


const params = queryString.parse(window.location.search);

class SaveDataQueue {
  constructor(onSave) {
    this._last = null;
    this._onSave = onSave;
    setInterval(() => {
      this._autoSave();
    }, 1000);
  }

  push(data) {
    if (this._last) {
      const { contentId } = this._last;
      if (contentId !== data?.contentId) {
        this._saveNow(); // save old
        this._last = data;
        return;
      }
    }
    this._last = data;      
  }
  //
  _autoSave() {
    if (!this._last) return;
    //
    const { lastChange } = this._last;
    const now = new Date().valueOf();
    if (now - lastChange > 3000) {
      this._saveNow();
    }
  }

  _saveNow() {
    assert(this._last);
    this._onSave(this._last);
    this._last = null;
  }
}

function Editor(props) {
  //
  function doSaveData({contentId, content}) {
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
    //
  }

  const saveDataQueueRef = useRef(new SaveDataQueue(doSaveData));
  const lastDataRef = useRef({});
  //

  function handleChange(content) {
    //
    if (!props.contentId) {
      return;
    }
    //
    if (lastDataRef.current.contentId === props.contentId
      && lastDataRef.current.markdown.trim() === content.markdown.trim()) {
      return;
    }
    lastDataRef.current = {
      contentId: props.contentId,
      markdown: content.markdown,
    };
    //
    saveDataQueueRef.current.push({
      content,
      contentId: props.contentId,
      lastChange: new Date().valueOf(),
    });
  }

  useEffect(() => {
    // content changed
    saveDataQueueRef.current.push(null);
    lastDataRef.current = {
      markdown: props.markdown,
      contentId: props.contentId,
    };
  }, [props.contentId, props.markdown]);

  //
  const theme = params.theme || 'lite';

  return (
    <MarkdownEditor
      theme={theme}
      onChange={handleChange}
      markdown={props.markdown}
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
