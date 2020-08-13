/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import i18n from 'i18n-js';

import NoteList from '../components/NoteList';

import dataStore, { KEYS, connect } from '../data_store';

const StarredNotesScreen: () => React$Node = (props) => {
  //
  const notes = props[KEYS.STARRED_NOTES] || [];
  //
  useEffect(() => {
    //
    dataStore.initStarredNotes();
    //
  }, []);
  //
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.content}>
        <NoteList notes={notes} style={styles.body} />
      </SafeAreaView>
    </>
  );
};

const StarredNotesScreenImpl = connect(KEYS.STARRED_NOTES)(StarredNotesScreen);

StarredNotesScreenImpl.options = {
  topBar: {
    title: {
      text: i18n.t('titleStarredNotes'),
      // color: 'black'
    },
    largeTitle: {
      visible: true,
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
  },
  body: {
    backgroundColor: Colors.white,
    minHeight: '100%',
    flexGrow: 1,
  },
});

export default StarredNotesScreenImpl;
