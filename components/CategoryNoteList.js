import React, { useEffect, useRef } from 'react';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from './NoteList';

const CategoryNoteList: () => React$Node = (props) => {
  const selectedTypeRef = useRef('');
  useEffect(() => {
    dataStore.resetCategoryNotes(undefined, () => {
      selectedTypeRef.current = dataStore.getSelectedType();
    });
  }, [props.selectedType]);
  //
  const selectedType = props.selectedType;
  const notes = props[KEYS.CATEGORY_NOTES] || [];
  const selectedNote = props[KEYS.CURRENT_NOTE] || {};
  const showHighlight = selectedType === '#searchResult';
  const showStar = selectedTypeRef.current !== '#starredNotes';
  //
  return (
    <NoteList
      notes={notes}
      onPressNote={props.onPressNote}
      selectedNoteGuid={selectedNote?.guid}
      showStar={showStar}
      showHighlight={showHighlight}
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
