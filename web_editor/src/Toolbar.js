import React, { useEffect, useRef } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Icon from './icon';

const userAgent = navigator.userAgent.toLowerCase();
const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: theme.panelBackgroundColor,
    height: '50px',
    width: '100vw',
    overflowX: 'scroll',
    display: 'none',
    position: 'fixed',
    left: 0,
    bottom: '30vh',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  active: {
    display: 'block'
  },
  container: {
    whiteSpace: 'nowrap',
    textAlign: 'center',
    padding: '5px 0',
  },
  iconBtn: {
    display: 'inline-block',
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    outline: 'none',
    border: 'none',
  },
  marginRight: {
    marginRight: 50
  }
}));

export default function Toolbar({isCursorInTable, editor, isShow}) {
  const style = useStyles()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  console.log('isTablet', isTablet);
  const BaseBtnListRef = useRef([
    {
      type: 'tag',
      iconName: 'jinghao'
    },
    {
      type: 'bold',
      iconName: 'cuti'
    },
    {
      type: 'italic',
      iconName: 'xieti'
    },
    {
      type: 'deletedLine',
      iconName: 'shanchuxianstrikethrough2'
    },
    {
      type: 'orderList',
      iconName: 'youxuliebiao'
    },
    {
      type: 'bulletList',
      iconName: 'wuxuliebiao',
      marginRight: true,
    },
    {
      type: 'link',
      iconName: 'lianjie'
    },
    {
      type: 'checkedBox',
      iconName: 'xuanzekuang'
    },
    {
      type: 'table',
      iconName: 'zu'
    },
    {
      type: 'image',
      iconName: 'image'
    },
    {
      type: 'dividingLine',
      iconName: 'fengexian'
    },
    {
      type: 'code',
      iconName: 'cc-code'
    },
    {
      type: 'codeBlock',
      iconName: 'hangneidaima'
    },
    {
      type: 'quote',
      iconName: 'zu1'
    },
    {
      type: 'formula',
      iconName: 'gongshi_putong'
    }
  ])
  const TableBtnListRef = useRef([
    {
      type: 'bold',
      iconName: 'cuti'
    },
    {
      type: 'italic',
      iconName: 'xieti'
    },
    {
      type: 'deletedLine',
      iconName: 'shanchuxianstrikethrough2'
    },
    {
      type: 'checkedBox',
      iconName: 'xuanzekuang',
      marginRight: true,
    },
    {
      type: 'alignLeft',
      iconName: 'duiqifangshi_zuo'
    },
    {
      type: 'alignCenter',
      iconName: 'duiqifangshi_zhong'
    },
    {
      type: 'alignRight',
      iconName: 'duiqifangshi_you'
    },
    {
      type: 'insertRowBefore',
      iconName: 'charuhang_shang'
    },
    {
      type: 'insertRowAfter',
      iconName: 'charuhang_xia'
    },
    {
      type: 'insertColBefore',
      iconName: 'charulie_zuo'
    },
    {
      type: 'insertColAfter',
      iconName: 'charulie_you'
    },
    {
      type: 'deleteRow',
      iconName: 'shanchuhang'
    },
    {
      type: 'deleteCol',
      iconName: 'shanchulie'
    },
    {
      type: 'deleteTable',
      iconName: 'shanchubiaoge'
    },
  ])
  const stopClickRef = useRef(false);
  useEffect(() => {
    document.addEventListener(
      'click',
      (e) => {
        if (stopClickRef.current) {
          stopClickRef.current = false;
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }, []);
  function handleClick(type, e) {
    switch (type) {
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
        stopClickRef.current = true;
        editor.insertTable();
        break;
      case 'image':
        stopClickRef.current = true;
        editor.insertImage();
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
    e.preventDefault();
  }
  return (
    <div className={style.toolbar + (isShow ? ` ${style.active}` : '')}>
      <div className={style.container}>
        {(isCursorInTable ? TableBtnListRef : BaseBtnListRef).current.map(item => (
          <button type="button" className={style.iconBtn + (item.marginRight && isTablet ? ` ${style.marginRight}` : '')} onMouseDown={(e) => handleClick(item.type, e)} key={item.type}>
            <Icon name={item.iconName} size={20} color={prefersDarkMode ? '#fff' : undefined} />
          </button>
        ))}
      </div>
    </div>
  )
}