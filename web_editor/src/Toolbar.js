import React, { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Icon from './icon';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: theme.panelBackgroundColor,
    height: '50px',
    position: 'fixed',
    left: 10,
    right: 10,
    bottom: 0,
    zIndex: 9999,
    width: '100vw',
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  container: {
    height: 50,
    display: 'flex',
    minWidth: '100vw',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    flexBasis: '40px',
    flexShrink: 0,
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

export default function Toolbar() {
  const style = useStyles()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [btnList, setBtnList] = useState(BaseBtnList);
  function handleClick(type) {
    console.log(type);
  }
  return (
    <div className={style.toolbar}>
      <div className={style.container} style={{width: `${btnList.length * 40}px`}}>
        {btnList.map(item => (
          <button type="button" className={style.iconBtn} onClick={handleClick(item.type)} key={item.type}>
            <Icon name={item.iconName} size={20} color={prefersDarkMode ? '#fff' : undefined} />
          </button>
        ))}
      </div>
    </div>
  )
}