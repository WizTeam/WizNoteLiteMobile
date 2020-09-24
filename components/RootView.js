import React from 'react';
import { StyleSheet, View } from 'react-native';

import { isTablet, reportDeviceTypeChanged, updateDeviceType } from '../utils/device';
import { setMainAsRoot } from '../services/navigation';
//
let deviceIsTablet = isTablet();

const RootView: () => React$Node = (props) => {
  //
  const isPad = deviceIsTablet;
  //
  function handleLayout({ nativeEvent }) {
    const width = nativeEvent.layout.width;
    const height = nativeEvent.layout.height;
    const currentIsTablet = updateDeviceType(width, height);
    if (currentIsTablet !== isPad) {
      deviceIsTablet = currentIsTablet;
      reportDeviceTypeChanged(deviceIsTablet);
      //
      setTimeout(() => {
        setMainAsRoot(deviceIsTablet);
      });
    }
  }
  //
  return (
    <View style={styles.root} onLayout={handleLayout}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default RootView;
