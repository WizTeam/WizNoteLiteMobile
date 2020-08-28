/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18n from 'i18n-js';

import { SideMenuView } from 'react-native-navigation-drawer-extension';
import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import { showDrawer } from '../components/MainDrawer';
import ThemedStatusBar from '../components/ThemedStatusBar';
import { updateNavigationTheme } from '../components/ThemeListener';
import { viewNote, createNewNote } from '../services/view_note';

import { KEYS, connect } from '../data_store';
import CategoryNoteList from '../components/CategoryNoteList';
import { getDeviceDynamicColor } from '../config/Colors';

const NotesScreen: () => React$Node = (props) => {
  //
  useEffect(() => {
    const type = props.selectedType;
    let title;
    if (type === '#allNotes') {
      title = i18n.t('itemAllNotes');
    } else if (type === '#trash') {
      title = i18n.t('itemTrash');
    } else {
      title = type;
    }
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        title: {
          text: title,
        },
      },
    });
  }, [props.selectedType]);

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
      if (buttonId === 'MainMenuButton') {
        showDrawer(props.componentId);
      } else if (buttonId === 'NewNoteButton') {
        createNewNote();
      }
    });
    return () => listener.remove();
  }, []);

  function handleThemeChanged(themeName) {
    updateNavigationTheme(props.componentId, themeName);
    //
    // force update buttons color
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        leftButtons: [],
      },
    });
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        leftButtons: [{
          id: 'MainMenuButton',
          icon: require('../images/icons/menu.png'),
        }],
      },
    });
  }

  function handlePressNote() {
    viewNote(props.componentId);
  }

  const styles = useDynamicValue(dynamicStyles);

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar onThemeChanged={handleThemeChanged} />
      <SafeAreaView style={styles.content}>
        <SideMenuView
          style={styles.root}
          left={showDrawer}
        >
          <CategoryNoteList style={styles.body} showStar onPressNote={handlePressNote} />
        </SideMenuView>
      </SafeAreaView>
    </ColorSchemeProvider>
  );
};

const NotesScreenImpl = connect([KEYS.SELECTED_TYPE])(NotesScreen);

NotesScreenImpl.options = {
  topBar: {
    largeTitle: {
      visible: true,
      color: 'red',
    },
    title: {
      text: i18n.t('itemAllNotes'),
    },
    leftButtons: [{
      id: 'MainMenuButton',
      icon: require('../images/icons/menu.png'),
    }],
    rightButtons: [{
      id: 'NewNoteButton',
      icon: require('../images/icons/menu.png'),
    }],
  },
};

const dynamicStyles = new DynamicStyleSheet({
  content: {
    display: 'flex',
    flex: 1,
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  body: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
    minHeight: '100%',
    flexGrow: 1,
  },
});

export default NotesScreenImpl;
