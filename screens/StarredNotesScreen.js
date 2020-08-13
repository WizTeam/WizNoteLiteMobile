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
  Text,
  StatusBar,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
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
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Starred notes list Screen</Text>
            </View>
            <NoteList notes={notes} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const StarredNotesScreenImpl = connect(KEYS.STARRED_NOTES)(StarredNotesScreen);

StarredNotesScreenImpl.options = {
  topBar: {
    title: {
      text: 'Starred Notes',
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
  scrollView: {
    backgroundColor: Colors.lighter,
    minHeight: '100%',
  },
  body: {
    backgroundColor: Colors.white,
    minHeight: '100%',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
});

export default StarredNotesScreenImpl;
