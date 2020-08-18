import React from 'react';
import { View, StyleSheet } from 'react-native';

import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import TriplePaneLayout from '../components/TriplePaneLayout';
import MainDrawer from '../components/MainDrawer';
import CategoryNoteList from '../components/CategoryNoteList';
import NoteEditor from '../components/NoteEditor';

// eslint-disable-next-line arrow-body-style
const PadMainScreen: () => React$Node = () => {
  //
  //
  return (
    <TriplePaneLayout
      pane1Width={300}
      pane2Width={400}
      pane1={<MainDrawer style={styles.drawer} />}
      pane2={(
        <View style={styles.noteListContainer}>
          <CategoryNoteList style={styles.noteList} />
        </View>
      )}
      pane3={(
        <NoteEditor style={styles.editor} />
      )}
    />
  );
};

const PadMainScreenImpl = gestureHandlerRootHOC(PadMainScreen);

PadMainScreenImpl.options = {
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#333333',
    flex: 1,
  },
  noteListContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
  },
  noteList: {
    flex: 1,
    height: '100%',
  },
  editor: {
    backgroundColor: 'gray',
    flex: 1,
    padding: 16,
  },
});

export default PadMainScreenImpl;
