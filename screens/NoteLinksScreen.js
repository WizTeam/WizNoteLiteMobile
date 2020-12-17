import React, { useEffect, useState } from 'react';
import i18n from 'i18n-js';
import { filter, match } from 'fuzzaldrin';

import { useDynamicValue } from 'react-native-dynamic';
import { Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Navigation } from '../thirdparty/react-native-navigation';
import Colors, { getDeviceDynamicColor, createDeviceDynamicStyles } from '../config/Colors';
import store from '../data_store';
import api from '../api';
import Icon from '../components/icon';

let allData = [];

export default function NoteLinks(props) {
  const [allTitle, setAllTitle] = useState([]);
  const [searchText, setSearchText] = useState('');

  function highlightTextView(title) {
    const res = match(title, searchText);
    if (res && res.length) {
      const positionArr = [];
      let pre = res[0];
      for (let i = 1; i < res.length; i++) {
        if (res[i] - res[i - 1] !== 1) {
          positionArr.push([pre, res[i - 1] + 1]);
          pre = res[i];
        }
      }
      positionArr.push([pre, res[res.length - 1] + 1]);
      return (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.selectItemText}>
          {positionArr.reduce((prev, curr, index) => {
            if (index === 0) {
              prev.push(title.substring(0, curr[0]));
            } else {
              prev.push(title.substring(positionArr[index - 1][1], curr[0]));
            }
            prev.push(
              <Text style={styles.highlightStyle}>{title.substring(curr[0], curr[1])}</Text>,
            );
            if (index === positionArr.length - 1) {
              prev.push(title.substring(curr[1]));
            }
            return prev;
          }, [])}
        </Text>
      );
    }
    return (<Text numberOfLines={1} ellipsizeMode="tail" style={styles.selectItemText}>{title}</Text>);
  }

  function handleSearchChange(text) {
    setSearchText(text);
    // console.log('text', text);
    const titleList = text ? filter(allData, text) : allData;
    setAllTitle(titleList);
  }

  function handleClose(title) {
    if (props.onSelect) {
      props.onSelect(title);
    }
    Navigation.dismissModal(props.componentId);
  }

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
      if (buttonId === 'CancelButton') {
        handleClose();
      }
    });

    async function getAllNoteTitles() {
      allData = await api.searchAllNotesTitle(store.getCurrentKb());

      console.log('titles', allData);

      setAllTitle(allData);
    }

    getAllNoteTitles();

    return () => listener.remove();
  }, []);

  const styles = useDynamicValue(dynamicStyles.styles);

  return (
    <SafeAreaView>
      <SearchBar
        platform="ios"
        placeholder={i18n.t('placeholderSearchAllNotes')}
        cancelButtonTitle={i18n.t('buttonCancelSearch')}
        containerStyle={styles.searchBarContainerStyle}
        inputContainerStyle={styles.searchBarInputContainerStyle}
        inputStyle={styles.searchBarInput}
        onChangeText={handleSearchChange}
        value={searchText}
      />
      <ScrollView>
        {allTitle.map((item, index) => (
          <TouchableOpacity
            key={index.toString()}
            style={styles.selectItem}
            onPress={() => handleClose(item)}
          >
            <Icon color="#448aff" name="note" size={30} />
            {highlightTextView(item)}
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const dynamicStyles = createDeviceDynamicStyles(() => ({
  searchBarContainerStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  searchBarInputContainerStyle: {
    backgroundColor: getDeviceDynamicColor('searchBarBackground'),
    height: 35,
  },
  searchBarInput: {
    color: getDeviceDynamicColor('noteListTitle'),
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  selectItemText: {
    flex: 1,
    color: getDeviceDynamicColor('noteListTitle'),
    fontSize: 18,
    marginLeft: 10,
  },
  highlightStyle: {
    color: Colors.primary,
  },
}));
