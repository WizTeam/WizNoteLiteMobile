import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import dataStore, { KEYS, connect } from '../data_store';

const NoteEditor: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initStarredNotes();
  }, []);

  //
  const note = props[KEYS.CURRENT_NOTE];
  //
  return (
    <View style={props.style}>
      {!note && <View />}
      {note && <Text>{note.markdown}</Text>}
    </View>
  );
};

export default connect([KEYS.CURRENT_NOTE])(NoteEditor);
