import React from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';

import { getDeviceDynamicColor } from '../config/Colors';
import api from '../api';

const BUTTON_WIDTH = 100;

export default function NoteListHiddenItem(props) {
  //
  const { note, swipeAnimatedValue, rowMap } = props;
  const styles = useDynamicValue(dynamicStyles);
  //
  const starButtonText = i18n.t(note.starred ? 'buttonUnstarNote' : 'buttonStarNote');

  function handleStarNote() {
    const row = rowMap[note.guid];
    row.closeRow(() => {
      api.setNoteStarred(note.kbGuid, note.guid, !note.starred);
    });
  }

  function handleDeleteNote() {
    const row = rowMap[note.guid];
    row.deleteRow(() => {
      api.deleteNote(note.kbGuid, note.guid);
    });
  }

  // function handlePutBackNote() {
  //   //
  // }

  //
  return (
    <Animated.View style={styles.rowBack}>
      <Animated.View style={[styles.backRightBtn, styles.starButton, {
        width: Animated.multiply(swipeAnimatedValue, -0.5),
        transform: [{
          translateX: Animated.multiply(swipeAnimatedValue, 0.5),
        }],
      }]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handleStarNote}
        >
          <Text numberOfLines={1} style={styles.backTextWhite}>{starButtonText}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.backRightBtn, styles.deleteButton, {
        width: Animated.multiply(swipeAnimatedValue, -0.5).interpolate({
          inputRange: [0, BUTTON_WIDTH, BUTTON_WIDTH + 1, 10000],
          outputRange: [0, BUTTON_WIDTH, BUTTON_WIDTH * 2, 20000],
        }),
      }]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handleDeleteNote}
        >
          <Text numberOfLines={1} style={styles.backTextWhite}>{i18n.t('buttonDelete')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const dynamicStyles = new DynamicStyleSheet({
  rowFront: {
    height: '100%',
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    height: '100%',
    width: '100%',
  },
  backRightBtn: {
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  backTextWhite: {
    color: 'white',
  },
  grow: {
    flexGrow: 1,
  },
  starButton: {
    backgroundColor: '#aaaaaa',
    height: '100%',
    right: 0,
    zIndex: 1,
  },
  deleteButton: {
    height: '100%',
    right: 0,
    backgroundColor: 'red',
    zIndex: 2,
  },
  button: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
