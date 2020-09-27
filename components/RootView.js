import React from 'react';
import { View } from 'react-native';
import { useDynamicValue } from 'react-native-dynamic';

import { isTablet, reportDeviceTypeChanged, updateDeviceType } from '../utils/device';
import { setMainAsRoot } from '../services/navigation';
import { getDeviceDynamicColor, createDeviceDynamicStyles } from '../config/Colors';

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
  const styles = useDynamicValue(dynamicStyles.styles);
  //
  return (
    <View style={styles.root} onLayout={handleLayout}>
      {props.children}
    </View>
  );
};

const dynamicStyles = createDeviceDynamicStyles(() => ({
  root: {
    flex: 1,
    backgroundColor: getDeviceDynamicColor('rootBackground'),
  },
}));

export default RootView;
