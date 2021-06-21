import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import i18n from 'i18n-js';

import { ColorSchemeProvider, useDynamicValue } from 'react-native-dynamic';
import { SearchBar } from 'react-native-elements';

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
import { getDeviceDynamicColor, getDeviceColor, createDeviceDynamicStyles } from '../config/Colors';
import { isPhone, isAndroid } from '../utils/device';
import RootView from '../components/RootView';
import { showPrivacyPolicy } from '../services/privacy_policy';

const NotesScreen: () => React$Node = (props) => {
  //
  const [searchText, setSearchText] = useState('');
  const [showSearchBarLoading, setShowSearchBarLoading] = useState(false);

  function handleSearchChange(text) {
    setSearchText(text);
  }

  function handleSearchCancel() {
    store.resetCategoryNotes('#allNotes');
  }

  async function handleSearchSubmit() {
    try {
      if (!searchText) {
        return;
      }
      setShowSearchBarLoading(true);
      const notes = await api.searchNotes(store.getCurrentKb(), searchText);
      store.setSearchResult(notes);
      setShowSearchBarLoading(false);
    } finally {
      //
      setShowSearchBarLoading(false);
    }
  }

  async function handleSearchFocus() {
    if (store.getSelectedType() !== '#searchResult') {
      store.setSearchResult([]);
    }
  }

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
    if (type !== '#searchResult') {
      setSearchText('');
    }
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
    updateNavigationTheme(props.componentId, themeName, props[KEYS.USER_SETTING]?.colorTheme);
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

  useEffect(() => {
    if (props[KEYS.USER_SETTING]?.colorTheme) {
      updateNavigationTheme(props.componentId, undefined, props[KEYS.USER_SETTING]?.colorTheme);
    }
  }, [props[KEYS.USER_SETTING]?.colorTheme]);

  function handlePressNote() {
    viewNote(props.componentId, props[KEYS.USER_SETTING]?.colorTheme);
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
    store.resetCategoryNotes('#allNotes');
  }
  async function handleSearchBarSearch() {
    try {
      if (!searchTextRef.current) {
        return;
      }
      const notes = await api.searchNotes(store.getCurrentKb(), searchTextRef.current);
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

  useEffect(() => {
    showPrivacyPolicy();
  }, []);

  const styles = useDynamicValue(dynamicStyles.styles);

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar onThemeChanged={handleThemeChanged} />
      <RootView>
        <SafeAreaView style={styles.content}>
          <SideMenuView
            style={styles.root}
            left={showDrawer}
            sideMargin={32}
          >
            {
              isAndroid && isPhone
              && (
                <SearchBar
                  platform="ios"
                  showLoading={showSearchBarLoading}
                  placeholder={i18n.t('placeholderSearchAllNotes')}
                  cancelButtonTitle={i18n.t('buttonCancelSearch')}
                  containerStyle={styles.searchBarContainerStyle}
                  inputContainerStyle={styles.searchBarInputContainerStyle}
                  onChangeText={handleSearchChange}
                  onCancel={handleSearchCancel}
                  onSubmitEditing={handleSearchSubmit}
                  onFocus={handleSearchFocus}
                  value={searchText}
                />
              )
            }
            <CategoryNoteList style={styles.body} showStar onPressNote={handlePressNote} />
          </SideMenuView>
        </SafeAreaView>
      </RootView>
    </ColorSchemeProvider>
  );
};

const NotesScreenImpl = connect([KEYS.SELECTED_TYPE, KEYS.USER_SETTING])(NotesScreen);

NotesScreenImpl.options = {
  statusBar: {
    translucent: false,
    drawBehind: true,
    backgroundColor: 'transparent',
  },
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
  layout: {
    componentBackgroundColor: getDeviceColor('noteListBackground'),
    orientation: ['portrait'],
  },
};

const dynamicStyles = createDeviceDynamicStyles(() => ({
  content: {
    display: 'flex',
    flex: 1,
    // backgroundColor: 'transparent',
  },
  body: {
    // backgroundColor: getDeviceDynamicColor('noteListBackground'),
    minHeight: '100%',
    flexGrow: 1,
  },
  hiddenEditor: {
    display: 'none',
  },
  searchBarContainerStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  searchBarInputContainerStyle: {
    backgroundColor: getDeviceDynamicColor('searchBarBackground'),
  },
}));

export default NotesScreenImpl;
