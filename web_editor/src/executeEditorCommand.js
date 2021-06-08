import { blockUtils, containerUtils } from 'live-editor/client';

export function addExecuteEditorCommandListener(editor, insertImage) {
  window.executeEditorCommand = (command) => {
    const detail = editor.getSelectionDetail();
    if (detail.startBlock && detail.endBlock) {
      const blocks = [detail.startBlock];
      let targetBlock = detail.startBlock;

      while (targetBlock !== detail.endBlock) {
        targetBlock = containerUtils.getNextBlock(targetBlock);
        if (targetBlock) {
          blocks.push(targetBlock);
        }
      }
      blocks.forEach((block) => {
        const data = blockUtils.saveData(block);

        switch (command) {
          case 'header':
            editor.executeBlockCommand(`toHeading${((data.heading ?? 0) % 8) + 1}`, block);
            break;
          case 'tag':
            editor.executeTextCommand('tag', block);
            break;
          case 'bold':
            editor.executeTextCommand('style-bold', block);
            break;
          case 'italic':
            editor.executeTextCommand('style-italic', block);
            break;
          case 'deletedLine':
            editor.executeTextCommand('style-strikethrough', block);
            break;
          case 'orderList':
            editor.executeBlockCommand('toOrderedList', block);
            break;
          case 'bulletList':
            editor.executeBlockCommand('toUnorderedList', block);
            break;
          case 'link':
            editor.executeTextCommand('link', block);
            break;
          case 'checkedBox':
            editor.executeBlockCommand('toCheckbox', block);
            break;
          case 'table':
            editor.insertTable(-2, 4, 4);
            break;
          case 'image':
            insertImage();
            break;
          case 'dividingLine':
            editor.insertHorizontalLine(null, -2);
            break;
          case 'code':
            editor.insertCode(-2);
            break;
          case 'codeBlock':
            editor.insertCode(-2);
            break;
          case 'quote':
            editor.setBlockQuoted(block, !editor.isBlockQuoted(block));
            break;
          case 'formula':
            editor.executeTextCommand('inline-math');
            break;
          case 'alignLeft':
            editor.executeBlockCommand('alignLeft', block);
            break;
          case 'alignCenter':
            editor.executeBlockCommand('alignCenter', block);
            break;
          case 'alignRight':
            editor.executeBlockCommand('alignRight', block);
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
            editor.executeBlockCommand('table/deleteSelectedRows', block);
            break;
          case 'deleteCol':
            editor.executeBlockCommand('table/deleteSelectedCols', block);
            break;
          case 'deleteTable':
            editor.deleteBlock(block, {
              fromUndo: false,
              localAction: true,
            });
            break;
          case 'indent':
            editor.executeBlockCommand('indent', block);
            break;
          case 'unindent':
            editor.executeBlockCommand('outdent', block);
            break;
          case 'undo':
            editor.undo();
            break;
          case 'redo':
            editor.redo();
            break;
          case 'noteLink':
            editor.executeTextCommand('wiki-link', block);
            break;
          default:
            break;
        }
      });
    }
  };
}
