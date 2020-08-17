import React, { useEffect } from 'react';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from './NoteList';
import api from '../api';

const CategoryNoteList: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initCategoryNotes();
  }, [props.selectedType]);
  //
  const notes = props[KEYS.CATEGORY_NOTES] || [];
  const selectedNote = props[KEYS.CURRENT_NOTE] || {};

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
  KEYS.SELECTED_TYPE,
  KEYS.CATEGORY_NOTES,
  KEYS.CURRENT_NOTE,
])(CategoryNoteList);
