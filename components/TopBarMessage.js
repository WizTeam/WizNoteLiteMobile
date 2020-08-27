import React from 'react';
import { View, StyleSheet } from 'react-native';
import FlashMessage from "react-native-flash-message";

const TopFlashMessages = () => (
  <View style={styles.container}>
    <FlashMessage position="top" />
  </View>
);

const styles = StyleSheet.create({
  container: {
  },
});

export default TopFlashMessages;
