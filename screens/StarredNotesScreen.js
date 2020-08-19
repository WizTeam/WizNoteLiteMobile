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

import StarredNoteList from '../components/StarredNoteList';

import dataStore, { KEYS, connect } from '../data_store';

const StarredNotesScreen: () => React$Node = (props) => {
  //
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.content}>
        <StarredNoteList style={styles.body} />
      </SafeAreaView>
    </>
  );
};

StarredNotesScreen.options = {
  topBar: {
    title: {
      text: i18n.t('titleStarredNotes'),
      // color: 'black'
    },
    largeTitle: {
      visible: true,
    },
    leftButtons: [
      // {
      //   id: 'MainMenuButton',
      //   component: {
      //     name: 'MainMenuButton',
      //   },
      //   passProps: {
      //     // Pass initial props to the button here
      //   },
      // },
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

export default StarredNotesScreen;
