export function injectionCssFormId(id, css = '') {
  if (!id) return;
  //
  const element = document.querySelector(`#${id}`);
  const parentElement = element.parentElement;
  if (element && parentElement) {
    let style = Array
      .from(parentElement.childNodes)
      .find((node) => node.tagName.toLowerCase() === 'style');
    //
    if (!style) {
      style = document.createElement('style');
    }
    //
    style.innerHTML = css;
    parentElement.insertBefore(style, element);
  }
}

export function overwriteEditorConfig(options, id = 'editor-overwrite') {
  let style = document.querySelector(`#${id}`);
  //
  if (!style) {
    style = document.createElement('style');
    style.id = id;
  }
  let css = '';
  //
  Object.keys(options).forEach((item) => {
    const val = options[item];
    switch (item) {
      case 'fontFamily':
        css += `--editor-font-family: '${val}';`;
        break;
      case 'fontSize':
        css += `--editor-font-size: ${val}px;`;
        break;
      case 'lineHeight':
        {
          const h = Math.floor(val * options.fontSize);
          css += `--editor-line-height: ${h}px; --editor-first-line-center-top: calc(0.5 * var(--editor-line-height) - 1px);`;
        }
        break;
      case 'paragraphHeight':
        css += `--p-margin-bottom: ${val}px;`;
        break;
      case 'textColor':
        css += `--editor-color: ${val}`;
        break;
      default:
        break;
    }
  });
  //
  style.innerHTML = `:root,div.editor-main.mobile { ${css} }`;
  document.head.appendChild(style);
}
