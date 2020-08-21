/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { Header, ListItem } from 'react-native-elements';

import { RNNDrawer } from 'react-native-navigation-drawer-extension';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from 'i18n-js';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { isTablet } from '../utils/device';

import TreeView from '../thirdparty/react-native-final-tree-view';
import api from '../api';
import dataStore, { KEYS, connect } from '../data_store';
import UserButton from './UserButton';
import { setLoginAsRoot } from '../services/navigation';
import Colors, { getColor, getDynamicColor, getDeviceDynamicColor } from '../config/Colors';

const MainDrawer: () => React$Node = (props) => {
  //
  const styles = useDynamicValue(dynamicStyles);
  //
  function handleCloseDrawer() {
    RNNDrawer.dismissDrawer();
  }

  function handleLogin() {
    setLoginAsRoot();
    setTimeout(() => {
      handleCloseDrawer();
    }, 100);
  }

  function handleViewUserInfo() {
    //
  }

  //
  const [showTrash, setShowTrash] = useState(false);
  const [tags, setTags] = useState([]);

  async function resetTags() {
    //
    function convertTags(tagsData, currentTag, object) {
      for (const [key, value] of Object.entries(object)) {
        if (key === 'wizName') {
          if (!currentTag.name === value) {
            console.error(`invalid tags data, invalid name: ${value}, data: ${JSON.stringify(tagsData)}`);
          }
          currentTag.name = value;
        } else if (key === 'wizFull') {
          currentTag.id = value;
        } else {
          const childTag = {
            name: key,
            children: [],
          };
          convertTags(tagsData, childTag, value);
          if (!childTag.id) {
            console.error(`invalid tags data, no tag path: ${key}, data: ${JSON.stringify(tagsData)}`);
          }
          currentTag.children.push(childTag);
        }
      }
    }
    try {
      const tagsData = await api.getAllTags();
      const root = {
        children: [],
      };
      convertTags(tagsData, root, tagsData);
      setTags(root.children);
    } catch (err) {
      console.error(err);
    }
  }
  //
  useEffect(() => {
    async function shouldShowTrash() {
      try {
        const hasNotesInTrash = await api.hasNotesInTrash();
        setShowTrash(hasNotesInTrash);
        //
        resetTags();
      } catch (err) {
        console.error(err);
      }
    }
    shouldShowTrash();
  }, []);

  function handleRenderExpandButton({ isExpanded, hasChildrenNodes }) {
    if (!hasChildrenNodes) {
      return null;
    } else if (isExpanded) {
      return <Icon name="keyboard-arrow-down" size={24} style={styles.itemTitle} />;
    }

    return <Icon name="keyboard-arrow-right" size={24} style={styles.itemTitle} />;
  }

  function handleRenderSelectedMarker() {
    return <Icon name="brightness-1" size={12} style={styles.selectedMarker} />;
  }

  function handleGotoAllNotes() {
    dataStore.setSelectedType('#allNotes');
    handleCloseDrawer();
  }

  function handleGotoTrash() {
    dataStore.setSelectedType('#trash');
    handleCloseDrawer();
  }

  function handleClickTreeItem({ node }) {
    dataStore.setSelectedType(node.id);
    handleCloseDrawer();
  }

  const selectedType = props.selectedType || '#allNotes';
  //
  return (
    <View style={[styles.root, props.style]}>
      <Header
        barStyle="light-content"
        backgroundColor="transparent"
        containerStyle={{
          borderBottomColor: 'transparent',
        }}
        rightComponent={!isTablet && (
          <View style={{ marginRight: 8 }}>
            <TouchableHighlight onPress={handleCloseDrawer}>
              <View
                style={{
                  padding: 8,
                  paddingTop: 10,
                }}
              >
                <Icon name="close" style={styles.icon} size={24} />
              </View>
            </TouchableHighlight>
          </View>
        )}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        {isTablet && (
          <UserButton style={styles.padLoginButton} />
        )}

        <ListItem
          title={i18n.t('itemAllNotes')}
          containerStyle={styles.item}
          titleStyle={styles.itemTitle}
          onPress={handleGotoAllNotes}
          rightElement={selectedType === '#allNotes' && (
            <View style={styles.itemRightElement}>
              {handleRenderSelectedMarker()}
            </View>
          )}
        />
        {showTrash && (
          <ListItem
            title={i18n.t('itemTrash')}
            containerStyle={styles.item}
            titleStyle={styles.itemTitle}
            onPress={handleGotoTrash}
            rightElement={selectedType === '#trash' && (
              <View style={styles.itemRightElement}>
                {handleRenderSelectedMarker()}
              </View>
            )}
          />
        )}

        <TreeView
          containerStyle={{
            paddingTop: 44,
            flexGrow: 1,
          }}
          data={tags}
          renderExpandButton={handleRenderExpandButton}
          renderSelectedMarker={handleRenderSelectedMarker}
          getCollapsedNodeHeight={() => 44}
          onNodePress={handleClickTreeItem}
          itemContainerStyle={styles.treeItemContainerStyle}
          itemTitleStyle={styles.treeItemTitleStyle}
          itemContentContainerStyle={styles.treeItemContentContainerStyle}
          selected={selectedType}
        />
      </ScrollView>

      {!isTablet && (
        <UserButton
          onLogin={handleLogin}
          onPressUser={handleViewUserInfo}
          style={styles.phoneLoginButton}
        />
      )}
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  root: {
    flex: 1,
  },
  icon: {
    color: getDynamicColor('closeDrawerButton'),
  },
  scrollView: {
    backgroundColor: 'transparent',
    minHeight: '100%',
    display: 'flex',
    flex: 1,
  },
  item: {
    backgroundColor: 'transparent',
    paddingLeft: 44,
  },
  itemTitle: {
    color: getDeviceDynamicColor('drawerItemTitle'),
  },
  treeItem: {
    backgroundColor: 'transparent',
    marginLeft: 0,
    paddingLeft: 0,
  },
  treeItemContainerStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  treeItemTitleStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    color: getDeviceDynamicColor('drawerItemTitle'),
    paddingHorizontal: 0,
  },
  treeItemContentContainerStyle: {
    padding: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  selectedMarker: {
    paddingRight: 18,
    color: Colors.light.primary,
  },
  itemRightElement: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  padLoginButton: {
    paddingBottom: 32,
    paddingLeft: 16,
  },
  phoneLoginButton: {
    paddingTop: 32,
    paddingLeft: 16,
    paddingBottom: 64,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default connect(KEYS.SELECTED_TYPE)(MainDrawer);

export function showDrawer(parentComponentId) {
  RNNDrawer.showDrawer({
    component: {
      name: 'MainDrawer',
      passProps: {
        animationOpenTime: 300,
        animationCloseTime: 300,
        direction: 'left',
        dismissWhenTouchOutside: true,
        fadeOpacity: 0.6,
        drawerScreenWidth: '100%' || 445, // Use relative to screen '%' or absolute
        drawerScreenHeight: '100%' || 700,
        style: { // Styles the drawer container, supports any react-native style
          backgroundColor: getColor('drawerBackground'),
        },
        // Custom prop, will be available in your custom drawer component props
        // eslint-disable-next-line react/prop-types
        parentComponentId,
      },
    },
  });
}
