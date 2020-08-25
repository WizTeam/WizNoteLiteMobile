import React from 'react';
import { SafeAreaView } from 'react-native';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import ThemedStatusBar from '../components/ThemedStatusBar';
import { updateNavigationTheme } from '../components/ThemeListener';
import SearchResultNoteList from '../components/SearchResultNoteList';
import { viewNote } from '../services/view_note';
import { getDeviceDynamicColor } from '../config/Colors';

const SearchNotesScreen: () => React$Node = (props) => {
  //
  function handleThemeChanged(themeName) {
    updateNavigationTheme(props.componentId, themeName);
  }

  function handlePressNote() {
    viewNote(props.componentId);
  }

  const styles = useDynamicValue(dynamicStyles);

  return (
    <>
      <ThemedStatusBar onThemeChanged={handleThemeChanged} />
      <SafeAreaView style={styles.content}>
        <SearchResultNoteList style={styles.body} onPressNote={handlePressNote} />
      </SafeAreaView>
    </>
  );
};

SearchNotesScreen.options = {
  topBar: {
    noBorder: true,
    title: {
      component: {
        name: 'SearchNotesField',
        alignment: 'fill',
      },
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

export default SearchNotesScreen;
