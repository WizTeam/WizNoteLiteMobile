import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const NoteList: () => React$Node = (props) => {
  //
  const notes = props.notes;
  //
  return (
    <>
      {notes.map((note) => (
        <View style={styles.sectionContainer} key={note.guid}>
          <Text style={styles.sectionTitle}>{note.title}</Text>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
});

export default NoteList;
