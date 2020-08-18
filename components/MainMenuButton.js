import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showDrawer } from './MainDrawer';

const MainMenuButton: () => React$Node = (props) => {
  function handleOpenDrawer() {
    showDrawer(props.componentId);
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
