import React from 'react';
import {
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  ListItem,
  Divider,
} from 'react-native-elements';

import merge from 'lodash.merge';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { formatDateString } from '../utils/date';

const NoteList: () => React$Node = (props) => {
  //
  const notes = props.notes;
  const keyExtractor = (note) => note.guid;
  //
  function handlerPressItem(item) {
    //
  }
  //
  function renderItem({ item }) {
    const note = item;
    return (
      <>
        <ListItem
          onPress={handlerPressItem}
          key={note.guid}
          title={note.title}
          subtitle={formatDateString(note.modified)}
          containerStyle={styles.container}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
          titleProps={{
            numberOfLines: 2,
            ellipsizeMode: 'tail',
          }}
        />
        <Divider style={styles.divider} />
      </>
    );
  }
  //
  return (
    <FlatList
      style={merge(styles.list, props.style)}
      keyExtractor={keyExtractor}
      data={notes}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  list: {
  },
  container: {
    paddingLeft: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
  },
  divider: {
    marginLeft: 22,
    marginRight: 16,
  },
});

export default NoteList;
