import React, { useEffect } from 'react';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from './NoteList';

const CategoryNoteList: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initCategoryNotes();
  }, [props.selectedType]);
  //
  const notes = props[KEYS.CATEGORY_NOTES] || [];
  //
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <NoteList notes={notes} {...props} />
  );
};

export default connect([KEYS.SELECTED_TYPE, KEYS.CATEGORY_NOTES])(CategoryNoteList);
