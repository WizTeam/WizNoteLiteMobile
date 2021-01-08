import React, { useState, useEffect } from 'react';

import { MarkdownEditor } from 'wiz-react-markdown-editor';
import editor from 'wiz-react-markdown-editor/lib/editor';
import { injectionCssFormId, overwriteEditorConfig } from './utils';

const containerId = `wiz-note-content-root-${new Date().getTime()}`;

export function EditorViewer() {
  const [markdown, setMarkdown] = useState();

  useEffect(() => {
    window.setMarkdown = setMarkdown;
    window.checkTheme = (css) => {
      const id = 'wiz-note-content-root';
      const reg = new RegExp(id, 'g');
      injectionCssFormId(containerId, css.replace(reg, containerId));
    };
    window.setEditorTextStyle = (options) => {
      if (options) {
        overwriteEditorConfig(options);
        // console.log(options);
      }
    };
    return () => {
      window.setMarkdown = undefined;
      window.checkTheme = undefined;
      window.setEditorTextStyle = undefined;
    };
  }, []);

  return (
    <div
      id={containerId}
      className="editor-root"
    >
      <MarkdownEditor
        readOnly
        markdown={markdown}
      />
    </div>
  );
}
