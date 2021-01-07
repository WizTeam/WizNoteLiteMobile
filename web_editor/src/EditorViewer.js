import React, { useState, useEffect } from 'react';

import { MarkdownEditor } from 'wiz-react-markdown-editor';
import { injectionCssFormId } from './utils';

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
    return () => {
      window.setMarkdown = undefined;
      window.checkTheme = undefined;
    };
  }, []);

  return (
    <div
      id={containerId}
    >
      <MarkdownEditor
        readOnly
        markdown={markdown}
      />
    </div>
  );
}
