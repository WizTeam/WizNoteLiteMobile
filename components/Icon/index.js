/* eslint-disable */

import React from 'react';

import Tag from './Tag';
import Unindent from './Unindent';
import Indent from './Indent';
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
import StrickThrough from './StrickThrough';
import Italic from './Italic';
import CodeBlock from './CodeBlock';
import Right from './Right';
import Divide from './Divide';
import TodoList from './TodoList';
import Quote from './Quote';
import CodeInline from './CodeInline';
import TableDeleteCol from './TableDeleteCol';
import InsertLeft from './InsertLeft';
import OrderList from './OrderList';
import InsertAbove from './InsertAbove';
import Image from './Image';

let IconFont = ({ name, ...rest }) => {
  switch (name) {
    case 'tag':
      return <Tag key="1" {...rest} />;
    case 'unindent':
      return <Unindent key="2" {...rest} />;
    case 'indent':
      return <Indent key="3" {...rest} />;
    case 'bold':
      return <Bold key="4" {...rest} />;
    case 'table-delete-row':
      return <TableDeleteRow key="5" {...rest} />;
    case 'insert-right':
      return <InsertRight key="6" {...rest} />;
    case 'bullet':
      return <Bullet key="7" {...rest} />;
    case 'insert-under':
      return <InsertUnder key="8" {...rest} />;
    case 'table':
      return <Table key="9" {...rest} />;
    case 'link':
      return <Link key="10" {...rest} />;
    case 'table-delete':
      return <TableDelete key="11" {...rest} />;
    case 'left':
      return <Left key="12" {...rest} />;
    case 'title':
      return <Title key="13" {...rest} />;
    case 'center':
      return <Center key="14" {...rest} />;
    case 'strickThrough':
      return <StrickThrough key="15" {...rest} />;
    case 'italic':
      return <Italic key="16" {...rest} />;
    case 'code-block':
      return <CodeBlock key="17" {...rest} />;
    case 'right':
      return <Right key="18" {...rest} />;
    case 'divide':
      return <Divide key="19" {...rest} />;
    case 'todoList':
      return <TodoList key="20" {...rest} />;
    case 'quote':
      return <Quote key="21" {...rest} />;
    case 'code-inline':
      return <CodeInline key="22" {...rest} />;
    case 'table-delete-col':
      return <TableDeleteCol key="23" {...rest} />;
    case 'insert-left':
      return <InsertLeft key="24" {...rest} />;
    case 'orderList':
      return <OrderList key="25" {...rest} />;
    case 'insert-above':
      return <InsertAbove key="26" {...rest} />;
    case 'image':
      return <Image key="27" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
