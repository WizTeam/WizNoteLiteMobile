import React, { useEffect } from 'react';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from './NoteList';

const CategoryNoteList: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initCategoryNotes();
  }, [props.selectedType]);
  //
  const notes = props[KEYS.CATEGORY_NOTES] || [];
  const selectedNote = props[KEYS.CURRENT_NOTE] || {};

  //
  return (
    <NoteList
      notes={notes}
      onPressNote={props.onPressNote}
      selectedNoteGuid={selectedNote?.guid}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export default connect([
  KEYS.SELECTED_TYPE,
  KEYS.CATEGORY_NOTES,
  KEYS.CURRENT_NOTE,
])(CategoryNoteList);
