import React, { useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';

import api from '../api';
import store from '../data_store';
import { getDynamicColor } from '../config/Colors';

const SearchNotesField: () => React$Node = () => {
  //
  const [text, setText] = useState('');
  const [isLoading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    try {
      const notes = await api.searchNotes(store.getCurrentKb(), text);
      store.setSearchResult(notes);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    store.setSearchResult([]);
  }

  const styles = useDynamicValue(dynamicStyles);

  return (
    <SearchBar
      placeholder="Search Notes..."
      onChangeText={setText}
      onClear={handleClear}
      onCancel={handleClear}
      value={text}
      platform="ios"
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainerStyle}
      inputStyle={styles.inputStyle}
      showLoading={isLoading}
      returnKeyType="search"
      onSubmitEditing={handleSearch}
    />
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    backgroundColor: 'transparent',
    paddingBottom: 4,
    paddingTop: 4,
  },
  inputContainerStyle: {
    backgroundColor: getDynamicColor('searchFieldBackground'),
    minHeight: 28,
    height: 36,
  },
  inputStyle: {
    color: getDynamicColor('searchField'),
  },
});

export default SearchNotesField;
