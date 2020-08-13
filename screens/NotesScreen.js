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
import { KEYS, connect } from '../data_store';
import NoteList from '../components/NoteList';

const NotesScreen: () => React$Node = (props) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function loadNotes() {
      try {
        const type = props.selectedType || '#allNotes';
        const options = {};
        if (type === '#allNotes') {
          //
        } else if (type === '#trash') {
          options.trash = true;
        } else {
          options.tags = type;
        }
        //
        const allNotes = await api.getAllNotes(options);
        setNotes(allNotes);
      } catch (err) {
        console.error(err);
      }
    }
    loadNotes();
  }, [props.selectedType]);

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
            <NoteList notes={notes} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const NotesScreenImpl = connect(KEYS.SELECTED_TYPE)(NotesScreen);

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

export default NotesScreenImpl;
