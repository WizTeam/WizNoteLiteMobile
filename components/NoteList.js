import React from 'react';
import {
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  ListItem,
} from 'react-native-elements';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { formatDateString } from '../utils/date';

const NoteList: () => React$Node = (props) => {
  //
  const notes = props.notes;
  const keyExtractor = (note) => note.guid;
  //
  function renderItem({ item }) {
    const note = item;
    return (
      <ListItem
        key={note.guid}
        title={note.title}
        subtitle={formatDateString(note.modified)}
        bottomDivider
        titleStyle={styles.title}
        subTitleStyle={styles.subtitle}
        titleProps={{
          numberOfLines: 2,
          ellipsizeMode: 'tail',
        }}
      />
    );
  }
  //
  return (
    <FlatList
      style={props.style}
      keyExtractor={keyExtractor}
      data={notes}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '400',
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grey,
  },
});

export default NoteList;
