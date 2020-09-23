import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';

import { MarkdownEditor } from 'wiz-react-markdown-editor';

import './App.css';

const PhoneTheme = React.lazy(() => import('./PhoneTheme'));
const PadTheme = React.lazy(() => import('./PadTheme'));

const params = queryString.parse(window.location.search);
const isTablet = params.isTablet === 'true';

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
      ref={props.editorRef}
      style={props.style}
      onSave={handleSave}
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
      setBottomHeight(keyboardHeight);
      // setBottomHeight(312);
      return true;
    };
    //
    window.onKeyboardHide = () => {
      console.log('onKeyboardHide');
      setBottomHeight(0)
      return true;
    };
    //
    window.addImage = (url) => {
      console.log(`request add image: ${url}`);
      editorRef.current.resetCursor();
      editorRef.current.insertImage({src: url});
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
    <div className="App" style={{
      visibility: (data && data.contentId) ? 'visible' : 'hidden',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
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
