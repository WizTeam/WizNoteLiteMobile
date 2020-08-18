import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18n from 'i18n-js';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import dataStore, { KEYS, connect } from '../data_store';
import CategoryNoteList from '../components/CategoryNoteList';

const NotesScreen: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initCategoryNotes();
  }, [props.selectedType]);
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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.content}>
        <CategoryNoteList style={styles.body} showStar />
      </SafeAreaView>
    </>
  );
};

const NotesScreenImpl = connect([KEYS.SELECTED_TYPE])(NotesScreen);

NotesScreenImpl.options = {
  topBar: {
    largeTitle: {
      visible: true,
    },
    title: {
      text: 'WizNote Lite',
      // color: 'black'
    },
    leftButtons: [
      {
        id: 'MainMenuButton',
        component: {
          name: 'MainMenuButton',
        },
        passProps: {
          // Pass initial props to the button here
        },
      },
    ],
  },
};

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flex: 1,
  },
  body: {
    backgroundColor: Colors.white,
    minHeight: '100%',
    flexGrow: 1,
  },
});

export default NotesScreenImpl;
