import React, { useEffect } from 'react';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from './NoteList';

const StarredNoteList: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initStarredNotes();
  }, []);

  //
  const notes = props[KEYS.STARRED_NOTES] || [];
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
  KEYS.STARRED_NOTES,
  KEYS.CURRENT_NOTE,
])(StarredNoteList);
