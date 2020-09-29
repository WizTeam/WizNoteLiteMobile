/* eslint-disable */

import React from 'react';

import Formula from './Formula';
import Quote from './Quote';
import Code from './Code';
import Image from './Image';
import Table from './Table';
import CheckedBox from './CheckedBox';
import Link from './Link';
import DeletedLine from './DeletedLine';
import Italic from './Italic';
import Bold from './Bold';
import InsertColAfter from './InsertColAfter';
import InsertColBefore from './InsertColBefore';
import InsertRowBefore from './InsertRowBefore';
import Tag from './Tag';
import AlignLeft from './AlignLeft';
import AlignRight from './AlignRight';
import DividingLine from './DividingLine';
import AlignCenter from './AlignCenter';
import InsertRowAfter from './InsertRowAfter';
import DeleteTable from './DeleteTable';
import BulletList from './BulletList';
import DeleteRow from './DeleteRow';
import DeleteCol from './DeleteCol';
import CodeBlock from './CodeBlock';
import OrderList from './OrderList';
import InlineQuote from './InlineQuote';

let IconFont = ({ name, ...rest }) => {
  switch (name) {
    case 'formula':
      return <Formula key="1" {...rest} />;
    case 'quote':
      return <Quote key="2" {...rest} />;
    case 'code':
      return <Code key="3" {...rest} />;
    case 'image':
      return <Image key="4" {...rest} />;
    case 'table':
      return <Table key="5" {...rest} />;
    case 'checkedBox':
      return <CheckedBox key="6" {...rest} />;
    case 'link':
      return <Link key="7" {...rest} />;
    case 'deletedLine':
      return <DeletedLine key="8" {...rest} />;
    case 'italic':
      return <Italic key="9" {...rest} />;
    case 'bold':
      return <Bold key="10" {...rest} />;
    case 'insertColAfter':
      return <InsertColAfter key="11" {...rest} />;
    case 'insertColBefore':
      return <InsertColBefore key="12" {...rest} />;
    case 'insertRowBefore':
      return <InsertRowBefore key="13" {...rest} />;
    case 'tag':
      return <Tag key="14" {...rest} />;
    case 'alignLeft':
      return <AlignLeft key="15" {...rest} />;
    case 'alignRight':
      return <AlignRight key="16" {...rest} />;
    case 'dividingLine':
      return <DividingLine key="17" {...rest} />;
    case 'alignCenter':
      return <AlignCenter key="18" {...rest} />;
    case 'insertRowAfter':
      return <InsertRowAfter key="19" {...rest} />;
    case 'deleteTable':
      return <DeleteTable key="20" {...rest} />;
    case 'bulletList':
      return <BulletList key="21" {...rest} />;
    case 'deleteRow':
      return <DeleteRow key="22" {...rest} />;
    case 'deleteCol':
      return <DeleteCol key="23" {...rest} />;
    case 'codeBlock':
      return <CodeBlock key="24" {...rest} />;
    case 'orderList':
      return <OrderList key="25" {...rest} />;
    case 'inlineQuote':
      return <InlineQuote key="26" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
