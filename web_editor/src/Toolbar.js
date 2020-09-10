import React, { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Icon from './icon';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: theme.panelBackgroundColor,
    height: '50px',
    width: '100vw',
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
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
}));

const BaseBtnList = [
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
    type: 'unorderList',
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
];

const TableBtnList = [
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
    iconName: 'xuanzekuang'
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
]

export default function Toolbar() {
  const style = useStyles()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [btnList, setBtnList] = useState(BaseBtnList);
  function handleClick(type) {
    console.log(type);
  }
  return (
    <div className={style.toolbar}>
      <div className={style.container}>
        {btnList.map(item => (
          <button type="button" className={style.iconBtn} onClick={handleClick(item.type)} key={item.type}>
            <Icon name={item.iconName} size={20} color={prefersDarkMode ? '#fff' : undefined} />
          </button>
        ))}
      </div>
    </div>
  )
}