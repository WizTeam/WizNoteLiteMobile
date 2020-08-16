import React, { useEffect } from 'react';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from './NoteList';

const StarredNoteList: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initStarredNotes();
  }, []);

  //
  const notes = props[KEYS.STARRED_NOTES] || [];
  //
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <NoteList notes={notes} {...props} />
  );
};

export default connect([KEYS.STARRED_NOTES])(StarredNoteList);
