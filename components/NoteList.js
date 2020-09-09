import React, { useState, useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';

import { getDeviceDynamicColor } from '../config/Colors';
import { isTablet } from '../utils/device';
import dataStore from '../data_store';
import api from '../api';
import { showTopBarMessage } from '../services/navigation';
import { SwipeListView } from '../thirdparty/react-native-swipe-list-view';
import NoteListItem from './NoteListItem';
import NoteListHiddenItem from './NoteListHiddenItem';

const NoteList: () => React$Node = (props) => {
  //
  const listWidth = isTablet ? 368 : Dimensions.get('window').width;
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
    //
    return (
      <NoteListItem
        note={note}
        selected={selected}
        hideDivider={hideDivider}
        showStar={props.showStar}
        onPressItem={handlerPressItem}
      />
    );
  }

  function renderHiddenItem({ item }, rowMap) {
    //
    const note = item;
    //
    return (
      <NoteListHiddenItem note={note} rowMap={rowMap} />
    );
  }

  const animationIsRunningRef = useRef(false);

  function handleSwipeValueChange(swipeData, rowMap) {
    //
    const { key, value } = swipeData;
    const note = notes.find((item) => item.guid === key);
    if (!note) {
      return;
    }
    if (value < -listWidth
      && !animationIsRunningRef.current
    ) {
      const row = rowMap[key];
      if (!note._deletedInList) {
        note._deletedInList = true;
        animationIsRunningRef.current = true;
        row.deleteRow(() => {
          animationIsRunningRef.current = false;
          api.deleteNote(note.kbGuid, note.guid);
        });
      }
    }
  }

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
      // setRefreshing(true);
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
    <SwipeListView
      style={[styles.list, props.style]}
      keyExtractor={keyExtractor}
      data={notes}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      rightOpenValue={-140}
      rightActivationValue={-200}
      rightActionValue={-500}
      onSwipeValueChange={handleSwipeValueChange}
      useNativeDriver={false}
      disableRightSwipe
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
  dividerContainer: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  divider: {
    marginLeft: 22,
    marginRight: 16,
    backgroundColor: getDeviceDynamicColor('noteListDivider'),
  },
  hideDivider: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  star: {
    color: 'rgb(253, 201, 46)',
    paddingBottom: 24,
  },
  //
});

export default NoteList;
