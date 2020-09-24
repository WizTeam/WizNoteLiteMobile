import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { useDynamicValue } from 'react-native-dynamic';
import { Header, Text, SearchBar } from 'react-native-elements';
import i18n from 'i18n-js';

import api from '../api';
import CategoryNoteList from './CategoryNoteList';
import { getDeviceDynamicColor, getDeviceColor, createDeviceDynamicStyles } from '../config/Colors';
import { createNewNote } from '../services/new_note';
import store, { KEYS, connect } from '../data_store';

const PadNoteListTitle = connect([KEYS.SELECTED_TYPE])((props) => {
  //
  const styles = useDynamicValue(dynamicStyles.styles);
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
  return (<Text style={styles.title} h4>{pane2Title}</Text>);
});

const PadNoteList: () => React$Node = (props) => {
  //
  const styles = useDynamicValue(dynamicStyles.styles);
  //
  const [searchText, setSearchText] = useState('');
  const [showSearchBarLoading, setShowSearchBarLoading] = useState(false);
  //

  function handleCreateNote() {
    createNewNote();
  }

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
  //
  return (
    <View style={styles.noteListContainer}>
      <Header
        containerStyle={styles.listHeader}
        leftComponent={{
          icon: 'menu',
          onPress: props.onToggleMenu,
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
      <PadNoteListTitle />
      <SearchBar
        platform="ios"
        showCancel
        showLoading={showSearchBarLoading}
        placeholder={i18n.t('placeholderSearchAllNotes')}
        cancelButtonTitle={i18n.t('buttonCancelSearch')}
        containerStyle={styles.searchBarContainerStyle}
        inputContainerStyle={styles.searchBarInputContainerStyle}
        inputStyle={styles.searchBarInput}
        onChangeText={handleSearchChange}
        onCancel={handleSearchCancel}
        onSubmitEditing={handleSearchSubmit}
        onFocus={handleSearchFocus}
        value={searchText}
      />
      <CategoryNoteList style={styles.noteList} />
    </View>
  );
};

export default PadNoteList;

const dynamicStyles = createDeviceDynamicStyles(() => ({
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
    marginTop: 8,
    // backgroundColor: 'green',
    paddingLeft: 18,
    color: getDeviceDynamicColor('noteListTitle'),
  },
  listHeader: {
    backgroundColor: 'transparent',
    // backgroundColor: 'red',
    borderBottomColor: 'transparent',
    height: Platform.select({
      android: 56,
      // default: 44,
    }),
  },
  headerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  searchBarContainerStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  searchBarInputContainerStyle: {
    backgroundColor: getDeviceDynamicColor('searchBarBackground'),
  },
  searchBarInput: {
    color: getDeviceDynamicColor('noteListTitle'),
  },
}));
