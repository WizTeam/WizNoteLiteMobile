import React from 'react';
import {
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  ListItem,
  Divider,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import merge from 'lodash.merge';

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
          rightIcon={props.showStar && note.starred && (
            <Icon name="star" size={20} style={styles.star} />
          )}
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
  star: {
    color: 'rgb(253, 201, 46)',
  },
});

export default NoteList;
