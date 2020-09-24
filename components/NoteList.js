import React, { useState, useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import { useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';

import { getDeviceDynamicColor, createDeviceDynamicStyles } from '../config/Colors';
import { isTablet } from '../utils/device';
import dataStore from '../data_store';
import api from '../api';
import { showTopBarMessage, showUpgradeViDialog, showLoginDialog, showLogsDialog } from '../services/navigation';
import { SwipeListView } from '../thirdparty/react-native-swipe-list-view';
import NoteListItem, { updateNoteStar } from './NoteListItem';
import NoteListHiddenItem, { BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH } from './NoteListHiddenItem';

const NoteList: () => React$Node = (props) => {
  //
  const listWidth = isTablet() ? 368 : Dimensions.get('window').width;
  //
  const styles = useDynamicValue(dynamicStyles.styles);
  //
  const notes = props.notes || [];
  const keyExtractor = (note) => note.guid;
  //
  const selectedIndex = notes.findIndex((note) => note.guid === props.selectedNoteGuid);
  //
  async function handlerPressItem(note) {
    //
    if (isTablet()) {
      dataStore.setCurrentNote(note);
    } else {
      const markdown = await api.getNoteMarkdown(note.kbGuid, note.guid);
      const newNote = { ...note, markdown };
      dataStore.setCurrentNote(newNote);
      // eslint-disable-next-line no-param-reassign
      note = newNote;
    }
    //
    if (props.onPressNote) {
      props.onPressNote(note);
    }
  }
  //
  function renderItem({ item, index }) {
    const note = item;
    const selected = note.guid === props.selectedNoteGuid;
    //
    const hideDivider = isTablet() && (selected || index === selectedIndex - 1);
    //
    return (
      <NoteListItem
        note={note}
        selected={selected}
        hideDivider={hideDivider}
        showStar={props.showStar}
        showHighlight={props.showHighlight}
        onPressItem={handlerPressItem}
      />
    );
  }

  function renderHiddenItem({ item }, rowMap) {
    //
    const note = item;
    //
    return (
      <NoteListHiddenItem
        note={note}
        rowMap={rowMap}
        onUpdateNoteStar={updateNoteStar}
      />
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

  function handleViewLogs() {
    showLogsDialog();
  }

  function handleLogin() {
    showLoginDialog({
      closable: true,
    });
  }

  const [isRefreshing, setRefreshing] = useState(false);
  //
  async function handleRefresh() {
    setRefreshing(true);
    try {
      await api.syncKb(dataStore.getCurrentKb(), {
        manual: true,
      });
    } catch (err) {
      if (err.code === 'WizErrorNoAccount') {
        showTopBarMessage({
          message: i18n.t('errorSync'),
          description: i18n.t('errorNoAccount'),
          type: 'warning',
          buttons: [{
            title: i18n.t('buttonLoginOrSignUp'),
            onPress: handleLogin,
          }],
        });
      } else {
        showTopBarMessage({
          message: i18n.t('errorSync'),
          description: i18n.t('errorSyncMessage', { message: err.message }),
          type: 'error',
          buttons: [{
            title: i18n.t('buttonViewLog'),
            onPress: handleViewLogs,
          }],
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

    function handleVip() {
      //
      showUpgradeViDialog();
      console.debug('upgrade to vip');
    }

    function showUpgradeVipMessage(isVipExpired) {
      const messageId = isVipExpired ? 'errorVipExpiredSync' : 'errorUpgradeVipSync';
      const message = i18n.t(messageId);
      const buttonTitle = i18n.t(isVipExpired ? 'buttonRenewVip' : 'buttonUpgradeVip');
      //
      showTopBarMessage({
        message: i18n.t('errorSync'),
        description: message,
        type: 'error',
        buttons: [{
          title: buttonTitle,
          onPress: handleVip,
        }],
      });
    }

    function handleSyncFinish(userGuid, kbGuid, result) {
      setRefreshing(false);
      const error = result.error;
      if (error) {
        //
        let errorMessage = error.message;
        //
        if (error.code === 'WizErrorInvalidPassword') {
          errorMessage = i18n.t('errorInvalidPassword');
          return;
        } else if (error.externCode === 'WizErrorPayedPersonalExpired') {
          showUpgradeVipMessage(true);
          return;
        } else if (error.externCode === 'WizErrorFreePersonalExpired') {
          showUpgradeVipMessage(false);
          return;
        }
        //
        showTopBarMessage({
          message: i18n.t('errorSync'),
          description: i18n.t('errorSyncMessage', { message: errorMessage }),
          type: 'error',
          buttons: [{
            title: i18n.t('buttonViewLog'),
            onPress: handleViewLogs,
          }],
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
      rightOpenValue={-BUTTON_MIN_WIDTH * 2}
      rightActivationValue={-BUTTON_MAX_WIDTH * 2}
      rightActionValue={-500}
      onSwipeValueChange={handleSwipeValueChange}
      useNativeDriver={false}
      disableRightSwipe
    />
  );
};

const dynamicStyles = createDeviceDynamicStyles(() => ({
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
}));

export default NoteList;
