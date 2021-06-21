import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  createEditorPromise,
  markdown2Doc,
// } from './live-editor/client';
} from 'live-editor/client';
import { injectionCssFormId, overwriteEditorConfig } from './utils';

const containerId = `wiz-note-content-root-${new Date().getTime()}`;

export function EditorViewer(props) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNote = useCallback(async (initLocalData) => {
    const user = {
      avatarUrl: 'avatarUrl',
      userId: 'wiz-note-viewer',
      displayName: 'wiz-note-viewer',
    };
    const options = {
      local: true,
      initLocalData,
      placeholder: 'Please enter document title',
      markdownOnly: true,
      lineNumber: false,
      isMobile: true,
      titleInEditor: true,
      hideComments: true,
    };
    const auth = {
      appId: 'WizNoeLite',
      userId: '',
      permission: 'r',
      docId: '',
      token: '',
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    };
    await createEditorPromise(containerRef.current, options, auth);
  }, []);

  useEffect(() => {
    // window.setMarkdown = async (md) => {
    //   console.log('setMarkdown');
    //   const doc = markdown2Doc(md);
    //   await loadNote(doc);
    //   setIsLoading(false);
    // };
    // window.checkTheme = (css) => {
    //   const id = 'wiz-note-content-root';
    //   const reg = new RegExp(id, 'g');
    //   injectionCssFormId(containerId, css.replace(reg, containerId));
    // };
    window.setEditorTextStyle = (options) => {
      if (options) {
        overwriteEditorConfig(options);
      }
    };
    (async () => {
      const doc = markdown2Doc(props.md);
      await loadNote(doc);
      setIsLoading(false);
    })();

    return () => {
      // window.setMarkdown = undefined;
      // window.checkTheme = undefined;
      window.setEditorTextStyle = undefined;
    };
  }, [loadNote, props.md]);

  return (
    <div
      id={props.containerId}
      className="editor-root"
    >
      <div ref={containerRef} />
      {isLoading && (<div className="editor-view-loading"><span>loading....</span></div>)}
      {/* <MarkdownEditor
        readOnly
        markdown={markdown}
      /> */}
    </div>
  );
}
