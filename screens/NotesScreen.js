/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
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

import api from '../api';

const NotesScreen: () => React$Node = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function loadNotes() {
      const user = global.user;
      console.log(user);
      const { userGuid, kbGuid } = user;
      console.log(userGuid);
      console.log(kbGuid);
      try {
        const allNotes = await api.getAllNotes(userGuid, kbGuid);
        setNotes(allNotes);
      } catch (err) {
        console.error(err);
      }
    }
    loadNotes();
  }, []);

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
              <Text style={styles.sectionTitle}>Notes list Screen</Text>
            </View>
            {notes.map((note) => (
              <View style={styles.sectionContainer} key={note.guid}>
                <Text style={styles.sectionTitle}>{note.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

NotesScreen.options = {
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
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
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

export default NotesScreen;
