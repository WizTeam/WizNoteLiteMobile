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
        css += `--text-font-family: '${val}';`;
        break;
      case 'fontSize':
        css += `--text-font-size: ${val}px;`;
        break;
      case 'lineHeight':
        {
          const h = Math.floor(val * options.fontSize);
          css += `--text-line-height: ${h}px;`;
        }
        break;
      case 'paragraphHeight':
        css += `--p-margin-bottom: ${val}px;`;
        break;
      case 'textColor':
        css += `--text-font-color: ${val}`;
        break;
      default:
        break;
    }
  });
  //
  style.innerHTML = `.editor-root { ${css} }`;
  document.head.appendChild(style);
}
