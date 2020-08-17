import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import TriplePane from '../components/TriplePane';
import MainDrawer from '../components/MainDrawer';
import CategoryNoteList from '../components/CategoryNoteList';

const PadMainScreen: () => React$Node = () => {
  console.log('render');
  return (
    <TriplePane
      pane1Width={300}
      pane2Width={400}
      pane1={<MainDrawer style={styles.drawer} />}
      pane2={(
        <View style={styles.noteListContainer}>
          <CategoryNoteList style={styles.noteList} />
        </View>
      )}
      pane3={(
        <View style={styles.editor}>
          <Text>
            this is text. this is text. this is text. this is text. this is text.
            this is text. this is text. this is text. this is text. this is text.
            this is text. this is text. this is text. this is text. this is text.
            this is text. this is text. this is text. this is text. this is text.
            this is text. this is text. this is text. this is text. this is text.
          </Text>
        </View>
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
