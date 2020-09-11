import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, Animated, Vibration } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';

import { getDeviceDynamicColor } from '../config/Colors';
import api from '../api';

export const BUTTON_MIN_WIDTH = 100;
export const BUTTON_MAX_WIDTH = 150;

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
      if (props.onUpdateNoteStar) {
        props.onUpdateNoteStar(note.kbGuid, note.guid, !note.starred);
      }
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
  const oldSwipeValueRef = useRef(0);
  //
  useEffect(() => {
    function handleSwipeValueChanged({ value }) {
      //
      let rightToLeft;
      const old = oldSwipeValueRef.current;
      //
      if (value < old) {
        // right to left, <-
        rightToLeft = true;
      } else if (value > old) {
        rightToLeft = false;
      }
      //
      const position = -2 * BUTTON_MAX_WIDTH;
      //
      if (rightToLeft === true) {
        if (value < position && position < old) {
          Vibration.vibrate();
        }
      } else if (rightToLeft === false) {
        // eslint-disable-next-line no-lonely-if
        if (value > position && position > old) {
          Vibration.vibrate();
        }
      }
      //
      oldSwipeValueRef.current = value;
    }
    //
    swipeAnimatedValue.addListener(handleSwipeValueChanged);
    //
    return () => {
      swipeAnimatedValue.removeListener(handleSwipeValueChanged);
    };
  })
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
