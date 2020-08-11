import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RNNDrawer } from 'react-native-navigation-drawer-extension';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MainMenuButton: () => React$Node = (props) => {
  function handleOpenDrawer() {
    RNNDrawer.showDrawer({
      component: {
        name: 'MainDrawer',
        passProps: {
          animationOpenTime: 300,
          animationCloseTime: 300,
          direction: 'left',
          dismissWhenTouchOutside: true,
          fadeOpacity: 0.6,
          drawerScreenWidth: '75%' || 445, // Use relative to screen '%' or absolute
          drawerScreenHeight: '100%' || 700,
          style: { // Styles the drawer container, supports any react-native style
            backgroundColor: 'rgba(11, 11, 11, 0.8)',
          },
          // Custom prop, will be available in your custom drawer component props
          // eslint-disable-next-line react/prop-types
          parentComponentId: props.componentId,
        },
      },
    });
  }

  return (
    <TouchableHighlight onPress={handleOpenDrawer}>
      <View>
        <Icon name="menu" style={styles.icon} size={24} />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  icon: {
  },
});

export default MainMenuButton;
