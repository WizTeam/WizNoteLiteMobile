import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  createEditorPromise,
  markdown2Doc,
// } from './live-editor/client';
} from 'live-editor/client';
import { injectionCssFormId, overwriteEditorConfig } from './utils';

const containerId = `wiz-note-content-root-${new Date().getTime()}`;

export function EditorViewer() {
  const containerRef = useRef(null);

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
    window.setMarkdown = (md) => {
      const doc = markdown2Doc(md);
      loadNote(doc);
    };
    window.checkTheme = (css) => {
      const id = 'wiz-note-content-root';
      const reg = new RegExp(id, 'g');
      injectionCssFormId(containerId, css.replace(reg, containerId));
    };
    window.setEditorTextStyle = (options) => {
      if (options) {
        overwriteEditorConfig(options);
      }
    };
    return () => {
      window.setMarkdown = undefined;
      window.checkTheme = undefined;
      window.setEditorTextStyle = undefined;
    };
  }, [loadNote]);

  return (
    <div
      id={containerId}
      className="editor-root"
    >
      <div ref={containerRef} />
      {/* <MarkdownEditor
        readOnly
        markdown={markdown}
      /> */}
    </div>
  );
}
