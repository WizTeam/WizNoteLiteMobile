import React from 'react';
import {
  FlatList,
} from 'react-native';
import {
  ListItem,
  Divider,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import { getDeviceDynamicColor } from '../config/Colors';
import { isTablet } from '../utils/device';

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
    const hideDivider = isTablet && (selected || index === selectedIndex - 1);
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
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  selected: {
    backgroundColor: getDeviceDynamicColor('noteListSelectedBackground'),
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    paddingBottom: 8,
    color: getDeviceDynamicColor('noteListTitle'),
  },
  subtitle: {
    fontSize: 14,
    color: getDeviceDynamicColor('noteListSubTitle'),
  },
  divider: {
    marginLeft: 22,
    marginRight: 16,
    backgroundColor: getDeviceDynamicColor('noteListDivider'),
    // color: 'red',
  },
  star: {
    color: 'rgb(253, 201, 46)',
  },
});

export default NoteList;
