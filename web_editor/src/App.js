import React, { useRef, useEffect, useState } from 'react';
import assert from 'assert';

// import MarkdownEditor from './editor/src/index';
import MarkdownEditor from 'wiz-react-markdown-editor';

import 'wiz-react-markdown-editor/lib/index.min.css';
import './App.css';


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
    console.log('save now');
    this._onSave(this._last);
    this._last = null;
  }
}

function Editor(props) {
  //
  function doSaveData({contentId, content}) {
    console.log(`save ${contentId}, ${content.markdown}`);
  }

  const saveDataQueueRef = useRef(new SaveDataQueue(doSaveData));
  const lastDataRef = useRef({});
  //

  function handleChange(content) {
    //
    if (lastDataRef.current.contentId === props.contentId
      && lastDataRef.current.markdown === content.markdown) {
      console.log('not changed, skip');
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

  console.log(`render, contentId=`, props.contentId);

  useEffect(() => {
    // content changed
    saveDataQueueRef.current.push(null);
    lastDataRef.current = {
      markdown: props.markdown,
      contentId: props.contentId,
    };
  }, [props.contentId, props.markdown]);

  return (
    <MarkdownEditor
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
