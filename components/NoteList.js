import React from 'react';
import {
  FlatList,
} from 'react-native';
import {
  ListItem,
  Divider,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DynamicStyleSheet, DynamicValue, useDynamicValue } from 'react-native-dynamic';

import { formatDateString } from '../utils/date';

const NoteList: () => React$Node = (props) => {
  //
  const styles = useDynamicValue(dynamicStyles);
  //
  const notes = props.notes || [];
  const keyExtractor = (note) => note.guid;
  //
  const selectedIndex = notes.findIndex((note) => note.guid === props.selectedNoteGuid);
  //
  async function handlerPressItem(note) {
    props.onPressNote(note);
  }
  //
  function renderItem({ item, index }) {
    const note = item;
    const selected = note.guid === props.selectedNoteGuid;
    //
    const hideDivider = selected || index === selectedIndex - 1;
    const showDivider = !hideDivider;
    //
    return (
      <>
        <ListItem
          onPress={() => handlerPressItem(note)}
          key={note.guid}
          title={note.title}
          subtitle={formatDateString(note.modified)}
          rightIcon={props.showStar && note.starred && (
            <Icon name="star" size={20} style={styles.star} />
          )}
          containerStyle={[styles.itemContainer, selected && styles.selected]}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
          titleProps={{
            numberOfLines: 2,
            ellipsizeMode: 'tail',
          }}
        />
        {showDivider && <Divider style={styles.divider} />}
      </>
    );
  }
  //
  return (
    <FlatList
      style={[styles.list, props.style]}
      keyExtractor={keyExtractor}
      data={notes}
      renderItem={renderItem}
    />
  );
};

const dynamicStyles = new DynamicStyleSheet({
  list: {
  },
  itemContainer: {
    paddingLeft: 22,
    backgroundColor: new DynamicValue('rgb(240, 240, 240)', 'rgb(42, 42, 42)'),
  },
  selected: {
    backgroundColor: new DynamicValue('white', 'rgb(51, 51, 51)'),
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    paddingBottom: 8,
    color: new DynamicValue('rgb(51, 51, 51)', 'rgb(240, 240, 240)'),
  },
  subtitle: {
    fontSize: 14,
    color: new DynamicValue('rgb(170, 170, 170)', 'rgb(170, 170, 170)'),
  },
  divider: {
    marginLeft: 22,
    marginRight: 16,
    backgroundColor: new DynamicValue('rgb(216, 216, 216)', 'rgb(64, 64, 64)'),
    // color: 'red',
  },
  star: {
    color: 'rgb(253, 201, 46)',
  },
});

export default NoteList;
