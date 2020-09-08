import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';
import useStateWithCallback from 'use-state-with-callback';

import { getDeviceDynamicColor } from '../config/Colors';
import { isTablet } from '../utils/device';
import dataStore from '../data_store';
import api from '../api';
import { showTopBarMessage } from '../services/navigation';
import { formatDateString } from '../utils/date';
import HighlightText from './HighlightText';
import { SwipeListView } from '../thirdparty/react-native-swipe-list-view';

const useForceUpdate = () => useState()[1];

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
    const showStar = !!(props.showStar && note.starred);
    //
    return (
      <View>
        <ListItem
          onPress={() => handlerPressItem(note)}
          key={note.guid}
          containerStyle={[styles.itemContainer, selected && styles.selected]}
        >
          <ListItem.Content style={styles.itemContent}>
            <ListItem.Title numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
              <Text>{title}</Text>
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>{subTitle}</ListItem.Subtitle>
          </ListItem.Content>
          {showStar && <ListItem.Chevron name="star" size={20} color="rgb(253, 201, 46)" style={styles.star} />}
        </ListItem>
        <Divider style={[styles.divider, hideDivider && styles.hideDivider]} />
      </View>
    );
  }
  //
  function handleDeleteNote(note, rowMap) {
    const row = rowMap[note.guid];
    row.deleteRow(() => {
      api.deleteNote(note.kbGuid, note.guid);
    });
  }

  const [, setStarNote] = useStateWithCallback({}, ({ note, rowMap }) => {
    if (note) {
      setTimeout(() => {
        const row = rowMap[note.guid];
        row.closeRow(() => {
          setTimeout(() => {
            api.setNoteStarred(note.kbGuid, note.guid, note.starred);
            setStarNote({});
          });
        });
      });
    }
  });

  function handleStarNote(note, rowMap) {
    // eslint-disable-next-line no-param-reassign
    note.starred = !note.starred;
    setStarNote({ note, rowMap });
  }
  //
  function renderHiddenItem({ item }, rowMap) {
    //
    const note = item;
    const starButtonText = i18n.t(note.starred ? 'buttonUnstarNote' : 'buttonStarNote');
    //
    return (
      <View style={styles.rowBack}>
        <View style={styles.grow} />
        <TouchableOpacity
          style={[styles.backRightBtn, styles.starButton]}
          onPress={() => handleStarNote(item, rowMap)}
        >
          <Text style={styles.backTextWhite}>{starButtonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.deleteButton]}
          onPress={() => handleDeleteNote(item, rowMap)}
        >
          <Text style={styles.backTextWhite}>{i18n.t('buttonDelete')}</Text>
        </TouchableOpacity>
      </View>
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
  divider: {
    paddingLeft: 22,
    paddingRight: 16,
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
  rowFront: {
    height: '100%',
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    height: '100%',
  },
  backRightBtn: {
    alignItems: 'center',
    // bottom: 0,
    justifyContent: 'center',
    // position: 'absolute',
    // top: 0,
  },
  backTextWhite: {
    color: 'white',
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    // right: 0,
  },
  grow: {
    flexGrow: 1,
  },
  starButton: {
    width: 70,
    backgroundColor: '#aaaaaa',
    height: '100%',
  },
  deleteButton: {
    width: 70,
    height: '100%',
  },
});

export default NoteList;
