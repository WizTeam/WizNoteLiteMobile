import React from 'react';
import {
  SafeAreaView,
} from 'react-native';

import i18n from 'i18n-js';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import StarredNoteList from '../components/StarredNoteList';
import ThemedStatusBar from '../components/ThemedStatusBar';
import { updateNavigationTheme } from '../components/ThemeListener';

import { viewNote } from '../services/view_note';
import { getDeviceDynamicColor } from '../config/Colors';

const StarredNotesScreen: () => React$Node = (props) => {
  function handlePressNote() {
    viewNote(props.componentId);
  }
  //
  const styles = useDynamicValue(dynamicStyles);
  //
  function handleThemeChanged(themeName) {
    updateNavigationTheme(props.componentId, themeName);
  }
  //
  return (
    <>
      <ThemedStatusBar onThemeChanged={handleThemeChanged} />
      <SafeAreaView style={styles.content}>
        <StarredNoteList style={styles.body} onPressNote={handlePressNote} />
      </SafeAreaView>
    </>
  );
};

StarredNotesScreen.options = {
  topBar: {
    title: {
      text: i18n.t('titleStarredNotes'),
    },
    largeTitle: {
      visible: true,
    },
  },
};

const dynamicStyles = new DynamicStyleSheet({
  content: {
    display: 'flex',
    flex: 1,
  },
  body: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
    minHeight: '100%',
    flexGrow: 1,
  },
});

export default StarredNotesScreen;
