/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import {
  View, ScrollView,
} from 'react-native';
import { Header, ListItem } from 'react-native-elements';

import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from 'i18n-js';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { isTablet } from '../utils/device';

import TreeView from '../thirdparty/react-native-final-tree-view';
import { RNNDrawer } from '../thirdparty/react-native-navigation-drawer-extension';
import api from '../api';
import dataStore, { KEYS, connect } from '../data_store';
import UserButton from './UserButton';
import { setLoginAsRoot, showLoginDialog } from '../services/navigation';
import Colors, { getDeviceColor, getDeviceDynamicColor } from '../config/Colors';
import NotesIcon from './svg/NotesIcon';
import StarredIcon from './svg/StarredIcon';
import TrashIcon from './svg/TrashIcon';

const MainDrawer: () => React$Node = (props) => {
  //
  const styles = useDynamicValue(dynamicStyles);
  //
  function handleCloseDrawer() {
    RNNDrawer.dismissDrawer();
  }

  function handleLogin() {
    if (api.user.isLocalUser) {
      RNNDrawer.dismissDrawer();
      setTimeout(() => {
        showLoginDialog({
          closable: true,
        });
      }, 300);
    } else {
      setLoginAsRoot();
      setTimeout(() => {
        handleCloseDrawer();
      }, 100);
    }
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
    handleCloseDrawer();
    setTimeout(() => {
      dataStore.setSelectedType('#allNotes');
    }, 300);
  }

  function handleGotoStarredNotes() {
    handleCloseDrawer();
    setTimeout(() => {
      dataStore.setSelectedType('#starredNotes');
    }, 300);
  }

  function handleGotoTrash() {
    handleCloseDrawer();
    setTimeout(() => {
      dataStore.setSelectedType('#trash');
    }, 300);
  }

  function handleClickTreeItem({ node }) {
    handleCloseDrawer();
    setTimeout(() => {
      dataStore.setSelectedType(node.id);
    }, 300);
  }

  const selectedType = props.selectedType || '#allNotes';
  //
  const list = React.useMemo(() => [
    {
      title: i18n.t('itemAllNotes'),
      selectedType: '#allNotes',
      leftIcon: NotesIcon,
      onPress: () => { handleGotoAllNotes(); },
      isSelect: selectedType === '#allNotes',
      show: true,
    },
    {
      title: i18n.t('itemStarredNotes'),
      selectedType: '#starredNotes',
      leftIcon: StarredIcon,
      onPress: () => { handleGotoStarredNotes(); },
      isSelect: selectedType === '#starredNotes',
      show: true,
    },
    {
      title: i18n.t('itemTrash'),
      selectedType: '#trash',
      leftIcon: TrashIcon,
      onPress: () => { handleGotoTrash(); },
      isSelect: selectedType === '#trash',
      show: showTrash,
    },
  ], [styles, selectedType]);
  //
  return (
    <View style={[styles.root, props.style]}>
      <Header
        // barStyle="dark-content"
        backgroundColor="transparent"
        containerStyle={{
          borderBottomColor: 'transparent',
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        {isTablet && (
          <UserButton
            onLogin={handleLogin}
            onPressUser={handleViewUserInfo}
            style={styles.padLoginButton}
          />
        )}

        {
          list.map((item) => {
            if (!item.show) return <React.Fragment key={item.selectedType} />;
            if (isTablet) {
              return (
                <ListItem
                  key={item.selectedType}
                  title={item.title}
                  containerStyle={[
                    styles.item,
                    item.isSelect && styles.itemSelect,
                  ]}
                  titleStyle={[
                    styles.itemTitle,
                    item.isSelect && styles.itemSelectTitle,
                  ]}
                  onPress={item.onPress}
                  leftIcon={<item.leftIcon fill={item.isSelect ? '#fff' : styles.itemTitle.color} />}
                />
              );
            }
            return (
              <ListItem
                key={item.selectedType}
                title={item.title}
                containerStyle={styles.item}
                titleStyle={styles.itemTitle}
                onPress={item.onPress}
                rightElement={item.isSelect && (
                  <View style={styles.itemRightElement}>
                    {handleRenderSelectedMarker()}
                  </View>
                )}
              />
            );
          })
        }

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
          itemContainerStyle={{
            ...styles.treeItemContainerStyle,
            marginLeft: isTablet ? 16 : 0,
          }}
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
    flexDirection: 'column',
  },
  scrollView: {
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flex: 1,
  },
  item: {
    marginHorizontal: 16,
    backgroundColor: 'transparent',
  },
  itemSelect: {
    marginHorizontal: 16,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  itemSelectTitle: {
    color: '#ffffff',
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
    paddingLeft: 32,
  },
  phoneLoginButton: {
    paddingTop: 32,
    paddingLeft: 16,
    paddingBottom: 64,
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
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
        drawerScreenWidth: '80%' || 445, // Use relative to screen '%' or absolute
        drawerScreenHeight: '100%' || 700,
        style: { // Styles the drawer container, supports any react-native style
          backgroundColor: getDeviceColor('drawerBackground'),
        },
        // Custom prop, will be available in your custom drawer component props
        // eslint-disable-next-line react/prop-types
        parentComponentId,
      },
    },
  });
}
