import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native';
import i18n from 'i18n-js';

import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import { SideMenuView } from '../thirdparty/react-native-navigation-drawer-extension';
import { Navigation } from '../thirdparty/react-native-navigation';
import { showDrawer } from '../components/MainDrawer';
import ThemedStatusBar from '../components/ThemedStatusBar';
import { updateNavigationTheme } from '../components/ThemeListener';
import { viewNote } from '../services/view_note';
import { createNewNote } from '../services/new_note';

import api from '../api';
import store, { KEYS, connect } from '../data_store';
import CategoryNoteList from '../components/CategoryNoteList';
import { getDeviceDynamicColor } from '../config/Colors';
import IapListener from '../components/IapListener';

const NotesScreen: () => React$Node = (props) => {
  //
  useEffect(() => {
    const type = props.selectedType;
    let title;
    if (type === '#allNotes') {
      title = i18n.t('itemAllNotes');
    } else if (type === '#starredNotes') {
      title = i18n.t('itemStarredNotes');
    } else if (type === '#trash') {
      title = i18n.t('itemTrash');
    } else if (type === '#searchResult') {
      title = i18n.t('itemSearchResult');
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
        createNewNote(props.componentId);
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
          // eslint-disable-next-line import/no-unresolved
          icon: require('../images/icons/menu.png'),
        }],
        rightButtons: [{
          id: 'NewNoteButton',
          // eslint-disable-next-line import/no-unresolved
          icon: require('../images/icons/new_note.png'),
        }],
      },
    });
  }

  function handlePressNote() {
    viewNote(props.componentId);
  }

  const searchTextRef = useRef('');
  const cancelClickTime = useRef(0);

  function handleSearchBarUpdate({ text, isFocused }) {
    searchTextRef.current = text;
    if (!text) {
      if (isFocused) {
        const now = new Date().valueOf();
        if (now - cancelClickTime.current > 100) {
          store.setSearchResult([]);
        }
      }
    }
  }

  function handleSearchBarCancel() {
    cancelClickTime.current = new Date().valueOf();
    store.setSelectedType('#allNotes');
    store.initCategoryNotes();
  }
  async function handleSearchBarSearch() {
    try {
      if (!searchTextRef.current) {
        return;
      }
      const notes = await api.searchNotes(null, searchTextRef.current);
      store.setSearchResult(notes);
    } finally {
      //
    }
  }

  useEffect(() => {
    const events = Navigation.events();
    const listener1 = events.registerSearchBarUpdatedListener(handleSearchBarUpdate);
    const listener2 = events.registerSearchBarCancelPressedListener(handleSearchBarCancel);
    const listener3 = events.registerSearchBarSearchPressedListener(handleSearchBarSearch);
    return () => {
      listener1.remove();
      listener2.remove();
      listener3.remove();
    };
  }, []);

  const styles = useDynamicValue(dynamicStyles);

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar onThemeChanged={handleThemeChanged} />
      <IapListener />
      <SafeAreaView style={styles.content}>
        <SideMenuView
          style={styles.root}
          left={showDrawer}
          sideMargin={32}
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
    },
    title: {
      text: i18n.t('itemAllNotes'),
    },
    leftButtons: [{
      id: 'MainMenuButton',
      // eslint-disable-next-line import/no-unresolved
      icon: require('../images/icons/menu.png'),
    }],
    rightButtons: [{
      id: 'NewNoteButton',
      // eslint-disable-next-line import/no-unresolved
      icon: require('../images/icons/new_note.png'),
    }],
    searchBar: true,
    searchBarHiddenWhenScrolling: true,
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
  hiddenEditor: {
    display: 'none',
  },
});

export default NotesScreenImpl;
