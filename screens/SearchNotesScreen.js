/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

// eslint-disable-next-line arrow-body-style
const SearchNotesScreen: () => React$Node = () => {
  //
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <Header />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>search notes Screen</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Button title="Logout" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

SearchNotesScreen.options = {
  topBar: {
    title: {
      text: 'WizNote Lite',
      // color: 'black'
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

export default SearchNotesScreen;
