import React, { useEffect } from 'react';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from './NoteList';
import api from '../api';

const StarredNoteList: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initStarredNotes();
  }, []);

  //
  const notes = props[KEYS.STARRED_NOTES] || [];
  const selectedNote = props[KEYS.CURRENT_NOTE] || {};
  //
  async function handlePressNote(note) {
    const markdown = await api.getNoteMarkdown(note.kbGuid, note.guid);
    const newNote = { ...note, markdown };
    dataStore.setCurrentNote(newNote);
  }
  //
  return (
    <NoteList
      notes={notes}
      onPressNote={handlePressNote}
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
