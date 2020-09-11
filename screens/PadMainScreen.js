import React, { useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { Header, Text, SearchBar } from 'react-native-elements';
import i18n from 'i18n-js';

import api from '../api';
import TriplePaneLayout, { STATE as OPEN_STATE } from '../components/TriplePaneLayout';
import { gestureHandlerRootHOC } from '../thirdparty/react-native-gesture-handler';
import MainDrawer from '../components/MainDrawer';
import CategoryNoteList from '../components/CategoryNoteList';
import NoteEditor from '../components/NoteEditor';
import ThemedStatusBar from '../components/ThemedStatusBar';
import { getDeviceDynamicColor, getDeviceColor } from '../config/Colors';
import { createNewNote } from '../services/new_note';
import store, { KEYS, connect } from '../data_store';

const useForceUpdate = () => useState()[1];

// eslint-disable-next-line arrow-body-style
const PadMainScreen: () => React$Node = (props) => {
  //
  const layoutRef = useRef(null);
  //
  const styles = useDynamicValue(dynamicStyles);
  //
  const [searchText, setSearchText] = useState('');
  const [showSearchBarLoading, setShowSearchBarLoading] = useState(false);
  //
  const pane1Width = 288;
  const pane2Width = 368;
  //
  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);
  const windowWidth = Math.max(screenWidth, screenHeight);
  //
  const isLandscape = screenWidth > screenHeight;

  const editorMaxWidth = isLandscape
    ? Math.min(Math.min(screenWidth, screenHeight), windowWidth - pane2Width)
    : screenWidth;
  //
  const editorStyle = {
    ...styles.editor,
    width: editorMaxWidth,
  };

  function handleCreateNote() {
    createNewNote();
  }

  function handleToggleMenu() {
    //
    const openState = layoutRef.current.currentOpenState();
    if (openState === OPEN_STATE.openAll) {
      layoutRef.current.toggleOpenState(OPEN_STATE.open2);
    } else {
      layoutRef.current.toggleOpenState(OPEN_STATE.openAll);
    }
  }

  function handleGetExcludeRegions(state) {
    //
    let excludeRegions;
    if (state === OPEN_STATE.open2) {
      excludeRegions = [{
        x: 0,
        y: 60,
        width: pane2Width,
        height: screenHeight - 60,
      }];
    } else if (state === OPEN_STATE.openAll) {
      excludeRegions = [{
        x: pane1Width,
        y: 60,
        width: pane2Width,
        height: screenHeight - 60,
      }];
    }
    return excludeRegions;
  }

  function handleSearchChange(text) {
    setSearchText(text);
  }

  function handleSearchCancel() {
    store.setSelectedType('#allNotes');
    store.initCategoryNotes();
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

  function handleBeginEditing() {
    const layout = layoutRef.current;
    const openState = layout.currentOpenState();
    if (isLandscape) {
      if (openState === OPEN_STATE.openAll) {
        layoutRef.current.toggleOpenState(OPEN_STATE.open2);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (openState !== OPEN_STATE.closeAll) {
        // layoutRef.current.toggleOpenState(OPEN_STATE.closeAll);
      }
    }
  }

  //
  const forceUpdate = useForceUpdate();
  //
  const pane2Title = React.useMemo(() => {
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
    return title;
  }, [props.selectedType]);
  //
  return (
    <ColorSchemeProvider>
      <ThemedStatusBar />
      <TriplePaneLayout
        ref={layoutRef}
        onGetExcludeRegions={handleGetExcludeRegions}
        onLayout={forceUpdate}
        pane1Width={pane1Width}
        pane2Width={pane2Width}
        pane1={<MainDrawer style={styles.drawer} />}
        pane2={(
          <View style={styles.noteListContainer}>
            <Header
              containerStyle={styles.listHeader}
              leftComponent={{
                icon: 'menu',
                onPress: handleToggleMenu,
                style: styles.headerButton,
                color: getDeviceColor('noteListTitle'),
              }}
              rightComponent={{
                icon: 'add',
                onPress: handleCreateNote,
                style: styles.headerButton,
                color: getDeviceColor('noteListTitle'),
              }}
            />
            <Text style={styles.title} h4>{pane2Title}</Text>
            <SearchBar
              platform="ios"
              showCancel
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
            <CategoryNoteList style={styles.noteList} />
          </View>
        )}
        pane3={(
          <NoteEditor
            containerStyle={styles.editorContainer}
            editorStyle={editorStyle}
            onBeginEditing={handleBeginEditing}
          />
        )}
      />
    </ColorSchemeProvider>
  );
};

const PadMainScreenImpl = connect([KEYS.SELECTED_TYPE])(gestureHandlerRootHOC(PadMainScreen));

PadMainScreenImpl.options = {
  topBar: {
    visible: false,
  },
};

const dynamicStyles = new DynamicStyleSheet({
  drawer: {
    backgroundColor: getDeviceDynamicColor('drawerBackground'),
    flex: 1,
  },
  noteListContainer: {
    flex: 1,
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
    height: '100%',
  },
  noteList: {
    flex: 1,
    height: '100%',
  },
  title: {
    paddingLeft: 18,
    color: getDeviceDynamicColor('noteListTitle'),
  },
  listHeader: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  headerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editorContainer: {
    backgroundColor: getDeviceDynamicColor('noteBackground'),
    width: '100%',
    height: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  editor: {
    alignSelf: 'center',
    height: '100%',
    backgroundColor: getDeviceDynamicColor('noteBackground'),
  },
  searchBarContainerStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  searchBarInputContainerStyle: {
    backgroundColor: getDeviceDynamicColor('searchBarBackground'),
  },
});

export default PadMainScreenImpl;
