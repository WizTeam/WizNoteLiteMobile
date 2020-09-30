/* eslint-disable */

import React from 'react';

import Bold from './Bold';
import TableDeleteRow from './TableDeleteRow';
import InsertRight from './InsertRight';
import Bullet from './Bullet';
import InsertUnder from './InsertUnder';
import Table from './Table';
import Link from './Link';
import TableDelete from './TableDelete';
import Left from './Left';
import Title from './Title';
import Center from './Center';
import Strickthrough from './Strickthrough';
import Italic from './Italic';
import CodeBlock from './CodeBlock';
import Right from './Right';
import Divide from './Divide';
import Todolist from './Todolist';
import Quote from './Quote';
import CodeInline from './CodeInline';
import TableDeleteCol from './TableDeleteCol';
import InsertLeft from './InsertLeft';
import Orderlist from './Orderlist';
import InsertAbove from './InsertAbove';
import Image from './Image';

let IconFont = ({ name, ...rest }) => {
  switch (name) {
    case 'bold':
      return <Bold key="1" {...rest} />;
    case 'table-delete-row':
      return <TableDeleteRow key="2" {...rest} />;
    case 'insert-right':
      return <InsertRight key="3" {...rest} />;
    case 'bullet':
      return <Bullet key="4" {...rest} />;
    case 'insert-under':
      return <InsertUnder key="5" {...rest} />;
    case 'table':
      return <Table key="6" {...rest} />;
    case 'link':
      return <Link key="7" {...rest} />;
    case 'table-delete':
      return <TableDelete key="8" {...rest} />;
    case 'left':
      return <Left key="9" {...rest} />;
    case 'title':
      return <Title key="10" {...rest} />;
    case 'center':
      return <Center key="11" {...rest} />;
    case 'strickthrough':
      return <Strickthrough key="12" {...rest} />;
    case 'italic':
      return <Italic key="13" {...rest} />;
    case 'code-block':
      return <CodeBlock key="14" {...rest} />;
    case 'right':
      return <Right key="15" {...rest} />;
    case 'divide':
      return <Divide key="16" {...rest} />;
    case 'todolist':
      return <Todolist key="17" {...rest} />;
    case 'quote':
      return <Quote key="18" {...rest} />;
    case 'code-inline':
      return <CodeInline key="19" {...rest} />;
    case 'table-delete-col':
      return <TableDeleteCol key="20" {...rest} />;
    case 'insert-left':
      return <InsertLeft key="21" {...rest} />;
    case 'orderlist':
      return <Orderlist key="22" {...rest} />;
    case 'insert-above':
      return <InsertAbove key="23" {...rest} />;
    case 'image':
      return <Image key="24" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
