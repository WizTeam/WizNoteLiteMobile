import React, { useEffect } from 'react';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from './NoteList';

const SearchResultNoteList: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initStarredNotes();
  }, []);

  //
  const notes = props[KEYS.SEARCH_RESULT_NOTES] || [];
  const selectedNote = props[KEYS.CURRENT_NOTE] || {};
  //
  return (
    <NoteList
      notes={notes}
      onPressNote={props.onPressNote}
      selectedNoteGuid={selectedNote?.guid}
      showHighlight
      showStar
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export default connect([
  KEYS.SEARCH_RESULT_NOTES,
  KEYS.CURRENT_NOTE,
])(SearchResultNoteList);
