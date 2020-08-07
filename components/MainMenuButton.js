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
  StatusBar,
  Button,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RNNDrawer } from "react-native-navigation-drawer-extension";


const MainMenuButton: () => React$Node = (props) => {

  function openDrawer() {

    RNNDrawer.showDrawer({
      component: {
        name: "MainDrawer",
        passProps: {
          animationOpenTime: 300,
          animationCloseTime: 300,
          direction: "left",
          dismissWhenTouchOutside: true,
          fadeOpacity: 0.6,
          drawerScreenWidth: "75%" || 445, // Use relative to screen '%' or absolute
          drawerScreenHeight: "100%" || 700,
          style: { // Styles the drawer container, supports any react-native style
            backgroundColor: "rgba(11, 11, 11, 0.8)",
          },
          parentComponentId: props.componentId, // Custom prop, will be available in your custom drawer component props
        },
      }
    });    
  }
 
  return (
    <Button title="Menu" onPress={openDrawer} />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default MainMenuButton;
