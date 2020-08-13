import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18n from 'i18n-js';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import dataStore, { KEYS, connect } from '../data_store';
import NoteList from '../components/NoteList';

const NotesScreen: () => React$Node = (props) => {
  useEffect(() => {
    dataStore.initAllNotes();
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

  const notes = props[KEYS.ALL_NOTES] || [];
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
              <Text style={styles.sectionTitle}>Notes list Screen</Text>
            </View>
            <NoteList notes={notes} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const NotesScreenImpl = connect([KEYS.SELECTED_TYPE, KEYS.ALL_NOTES])(NotesScreen);

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
