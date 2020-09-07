import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, TouchableHighlight } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
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
  const animationValueMapRef = useRef(new Map());
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
    const map = animationValueMapRef.current;
    let animationValue = map.get(note.guid);
    //
    if (!animationValue) {
      animationValue = new Animated.Value(73);
      map.set(note.guid, animationValue);
    }
    //
    return (
      <Animated.View
        style={{
          height: animationValue,
        }}
        key={note.guid}
      >
        <TouchableHighlight style={styles.rowFront}>
          <View>
            <ListItem
              onPress={() => handlerPressItem(note)}
              key={note.guid}
              rightIcon={props.showStar && note.starred && (
                <Icon name="star" size={20} style={styles.star} />
              )}
              containerStyle={[styles.itemContainer, selected && styles.selected]}
            >
              <ListItem.Content style={styles.itemContent}>
                <ListItem.Title numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{title}</ListItem.Title>
                <ListItem.Subtitle style={styles.subtitle}>{subTitle}</ListItem.Subtitle>
              </ListItem.Content>
              {props.showStar && note.starred && (
                <Icon name="star" size={20} style={styles.star} />
              )}
            </ListItem>
            {showDivider && <Divider style={styles.divider} />}
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  }
  //
  //
  function renderHiddenItem() {
    return (
      <View style={styles.rowBack}>
        <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
          <Text style={styles.backTextWhite}>Delete</Text>
        </View>
      </View>
    );
  }

  const animationIsRunningRef = useRef(false);

  function handleSwipeValueChange(swipeData) {
    const { key, value } = swipeData;
    //
    const note = notes.find((item) => item.guid === key);
    if (!note) {
      return;
    }
    const map = animationValueMapRef.current;
    const animationValue = map.get(note.guid);
    if (!animationValue) {
      return;
    }
    //
    if (value < -listWidth
      && !animationIsRunningRef.current
    ) {
      console.log('start animation');
      animationIsRunningRef.current = true;
      //
      setTimeout(() => {
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          console.log('end animation');
          animationIsRunningRef.current = false;
          api.deleteNote(note.kbGuid, note.guid);
        });
      });
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
      rightOpenValue={-listWidth}
      onSwipeValueChange={handleSwipeValueChange}
      useNativeDriver={false}
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
  star: {
    color: 'rgb(253, 201, 46)',
  },
  //
  rowFront: {
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    marginRight: 8,
  },
  backTextWhite: {
    color: 'white',
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});

export default NoteList;
