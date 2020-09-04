import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';

import { getDeviceDynamicColor } from '../config/Colors';
import { isTablet } from '../utils/device';
import dataStore from '../data_store';
import api from '../api';
import { showTopBarMessage } from '../services/navigation';
import { formatDateString } from '../utils/date';
import HighlightText from './HighlightText';

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
    const markdown = await api.getNoteMarkdown(note.kbGuid, note.guid);
    const newNote = { ...note, markdown };
    dataStore.setCurrentNote(newNote);
    if (props.onPressNote) {
      props.onPressNote(newNote);
    }
  }
  //
  function renderItem({ item, index }) {
    const note = item;
    const selected = note.guid === props.selectedNoteGuid;
    //
    const hideDivider = isTablet && (selected || index === selectedIndex - 1);
    const showDivider = !hideDivider;
    //
    let title = note.title;
    let subTitle = formatDateString(note.modified);
    if (props.showHighlight && note.highlight) {
      if (note.highlight.title) {
        const highlightText = note.highlight.title.join(' ');
        title = <HighlightText text={highlightText} style={styles.title} />;
      }
      if (note.highlight.text) {
        const allText = note.highlight.text.join(' ');
        const highlightText = `${allText}\n\n${subTitle}`;
        subTitle = <HighlightText text={highlightText} style={styles.subtitle} />;
      }
    }
    //
    return (
      <>
        <ListItem
          onPress={() => handlerPressItem(note)}
          key={note.guid}
          rightIcon={props.showStar && note.starred && (
            <Icon name="star" size={20} style={styles.star} />
          )}
          style={[styles.itemContainer, selected && styles.selected]}
        >
          <ListItem.Content style={styles.itemContent}>
            <ListItem.Title numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{title}</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>{subTitle}</ListItem.Subtitle>
          </ListItem.Content>
          {props.showStar && note.starred && (
            <Icon name="star" size={20} style={styles.star} />
          )}
        </ListItem>
        {showDivider && <Divider style={styles.divider} />}
      </>
    );
  }
  //
  //

  const [isRefreshing, setRefreshing] = useState(false);
  //
  async function handleRefresh() {
    setRefreshing(true);
    try {
      await api.syncKb(null, {
        manual: true,
      });
    } catch (err) {
      if (err.code === 'WizErrorNoAccount') {
        showTopBarMessage({
          message: i18n.t('errorSync'),
          description: i18n.t('errorNoAccount'),
          type: 'warning',
        });
      } else {
        showTopBarMessage({
          message: i18n.t('errorSync'),
          description: i18n.t('errorSyncMessage', err.message),
          type: 'error',
        });
      }
      setRefreshing(false);
    }
  }
  //
  useEffect(() => {
    //
    function handleSyncStart() {
    }

    function handleSyncFinish(userGuid, kbGuid, result) {
      setRefreshing(false);
      const error = result.error;
      if (error) {
        showTopBarMessage({
          message: i18n.t('errorSync'),
          description: i18n.t('errorSyncMessage', error.message),
          type: 'error',
        });
      }
    }
    //
    api.on('syncStart', handleSyncStart);
    api.on('syncFinish', handleSyncFinish);
    //
    return () => {
      api.off('syncStart', handleSyncStart);
      api.off('syncFinish', handleSyncFinish);
    };
  }, []);

  //
  return (
    <FlatList
      style={[styles.list, props.style]}
      keyExtractor={keyExtractor}
      data={notes}
      renderItem={renderItem}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
    />
  );
};

const dynamicStyles = new DynamicStyleSheet({
  list: {
  },
  itemContainer: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  itemContent: {
    paddingLeft: 8,
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
