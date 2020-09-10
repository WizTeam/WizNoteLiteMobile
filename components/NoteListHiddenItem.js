import React from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';

import { getDeviceDynamicColor } from '../config/Colors';
import api from '../api';

const BUTTON_MIN_WIDTH = 70;
const BUTTON_MAX_WIDTH = 120;

export default function NoteListHiddenItem(props) {
  //
  const { note, swipeAnimatedValue, rowMap } = props;
  const styles = useDynamicValue(dynamicStyles);
  //
  const noteInTrash = note.trash;
  let firstButtonText;
  if (noteInTrash) {
    firstButtonText = i18n.t('buttonPutBackNote');
  } else {
    firstButtonText = i18n.t(note.starred ? 'buttonUnstarNote' : 'buttonStarNote');
  }
  //

  function handleFirstButtonPress() {
    const row = rowMap[note.guid];
    if (noteInTrash) {
      row.deleteRow(() => {
        api.putBackNote(note.kbGuid, note.guid);
      });
    } else {
      row.closeRow(() => {
        api.setNoteStarred(note.kbGuid, note.guid, !note.starred);
      });
    }
  }

  function handleDeleteNote() {
    const row = rowMap[note.guid];
    row.deleteRow(() => {
      api.deleteNote(note.kbGuid, note.guid);
    });
  }

  const offset = BUTTON_MAX_WIDTH - BUTTON_MIN_WIDTH;
  //
  const deletedButtonWidthValue = Animated.multiply(swipeAnimatedValue, -0.5).interpolate({
    inputRange: [0, BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH, 10000],
    outputRange: [BUTTON_MIN_WIDTH, BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH * 2, 20000],
  });
  const deletedButtonTranslateXValue = Animated.multiply(swipeAnimatedValue, -0.5).interpolate({
    inputRange: [0, BUTTON_MIN_WIDTH, BUTTON_MAX_WIDTH, 10000],
    outputRange: [0, -BUTTON_MIN_WIDTH, -BUTTON_MAX_WIDTH + offset, -BUTTON_MAX_WIDTH / 2],
  });
  //
  swipeAnimatedValue.addListener(({ value }) => {
    console.log(`org value: ${value}`);
  });
  //
  deletedButtonWidthValue.addListener(({ value }) => {
    console.log(`width: ${value}`);
  });
  deletedButtonTranslateXValue.addListener(({ value }) => {
    console.log(`offsetX: ${value}`);
  });

  //
  return (
    <Animated.View style={styles.rowBack}>
      <Animated.View style={[styles.backRightBtn, styles.starButton, {
        width: Animated.multiply(swipeAnimatedValue, -0.5).interpolate({
          inputRange: [-10000, -BUTTON_MIN_WIDTH, 0],
          outputRange: [10000, BUTTON_MIN_WIDTH, BUTTON_MIN_WIDTH],
        }),
        transform: [{
          translateX: Animated.add(swipeAnimatedValue, BUTTON_MIN_WIDTH),
        }],
      }]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handleFirstButtonPress}
        >
          <Text numberOfLines={1} style={styles.backTextWhite}>{firstButtonText}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.backRightBtn, styles.deleteButton, {
        width: deletedButtonWidthValue,
        transform: [{
          translateX: deletedButtonTranslateXValue,
        }],
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
    right: -BUTTON_MIN_WIDTH,
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
