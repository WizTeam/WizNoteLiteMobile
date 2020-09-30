export function addExecuteEditorCommandListener(editor, postMessage) {
  function insertImage() {
    editor.saveCursor();
    //
    const callback = `insertImage${new Date().getTime()}`;
    window[callback] = (url) => {
      // TODO: insert image at selection;
      editor.resetCursor();
      editor.insertImage({ src: url });
      window[callback] = undefined;
    };
    //
    postMessage({
      event: 'insertImage',
      callback,
    });
  }
  window.executeEditorCommand = (command) => {
    switch (command) {
      case 'tag':
        editor.insertTag();
        break;
      case 'bold':
        editor.insertBold();
        break;
      case 'italic':
        editor.insertItalic();
        break;
      case 'deletedLine':
        editor.insertDeletedLine();
        break;
      case 'orderList':
        editor.insertOrderList();
        break;
      case 'bulletList':
        editor.insertBulletList();
        break;
      case 'link':
        editor.insertLink();
        break;
      case 'checkedBox':
        editor.insertToDoList();
        break;
      case 'table':
        editor.insertTable();
        break;
      case 'image':
        insertImage();
        break;
      case 'dividingLine':
        editor.insertHorizontalLine();
        break;
      case 'code':
        editor.insertInlineCode();
        break;
      case 'codeBlock':
        editor.insertCodeBlock();
        break;
      case 'quote':
        editor.insertQuote();
        break;
      case 'formula':
        editor.insertMathFormula();
        break;
      case 'alignLeft':
        editor.tableColAlignLeft();
        break;
      case 'alignCenter':
        editor.tableColAlignCenter();
        break;
      case 'alignRight':
        editor.tableColAlignRight();
        break;
      case 'insertRowBefore':
        editor.insertRowAbove();
        break;
      case 'insertRowAfter':
        editor.insertRowBelow();
        break;
      case 'insertColBefore':
        editor.insertColLeft();
        break;
      case 'insertColAfter':
        editor.insertColRight();
        break;
      case 'deleteRow':
        editor.removeTableCol();
        break;
      case 'deleteCol':
        editor.removeTableRow();
        break;
      case 'deleteTable':
        editor.removeTable();
        break;
      default:
        break;
    }
  };
}
