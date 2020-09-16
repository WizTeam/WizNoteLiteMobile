/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
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
import Colors, { getDynamicColor, getDeviceDynamicColor, getDeviceColor } from '../config/Colors';
import CrownIcon from './svg/CrownIcon';
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

  //
  useEffect(() => {
    async function shouldShowTrash() {
      try {
        const hasNotesInTrash = await api.hasNotesInTrash(dataStore.getCurrentKb());
        setShowTrash(hasNotesInTrash);
        //
      } catch (err) {
        console.error(err);
      }
    }
    shouldShowTrash();
  }, []);

  function handleRenderExpandButton({ isExpanded, hasChildrenNodes, isSelected }) {
    let style = styles.itemTitle;
    if (isTablet && isSelected) {
      style = { color: '#fff' };
    }
    //
    if (!hasChildrenNodes) {
      return null;
    } else if (isExpanded) {
      return <Icon name="keyboard-arrow-down" size={24} style={style} />;
    }

    return <Icon name="keyboard-arrow-right" size={24} style={style} />;
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
      isSelected: selectedType === '#allNotes',
      show: true,
    },
    {
      title: i18n.t('itemStarredNotes'),
      selectedType: '#starredNotes',
      leftIcon: StarredIcon,
      onPress: () => { handleGotoStarredNotes(); },
      isSelected: selectedType === '#starredNotes',
      show: true,
    },
    {
      title: i18n.t('itemTrash'),
      selectedType: '#trash',
      leftIcon: TrashIcon,
      onPress: () => { handleGotoTrash(); },
      isSelected: selectedType === '#trash',
      show: showTrash,
    },
  ], [styles, selectedType, showTrash]);
  //
  const tags = props.tags;
  //
  return (
    <View style={[styles.root, props.style]}>
      <Header
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
            return (
              <ListItem
                key={item.selectedType}
                containerStyle={[
                  styles.item,
                  isTablet && styles.tabletItem,
                  isTablet && item.isSelected && styles.itemSelect,
                ]}
                onPress={item.onPress}
              >
                {isTablet && <item.leftIcon fill={item.isSelected ? '#fff' : styles.itemTitle.color} />}
                <ListItem.Content
                  style={!isTablet && styles.itemContent}
                >
                  <ListItem.Title
                    style={[
                      styles.itemTitle,
                      (isTablet && item.isSelected) && styles.itemSelectTitle,
                    ]}
                  >
                    {item.title}
                  </ListItem.Title>
                </ListItem.Content>
                {!isTablet && item.isSelected && (
                  <View style={styles.itemRightElement}>
                    {handleRenderSelectedMarker()}
                  </View>
                )}
              </ListItem>
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
          renderSelectedMarker={isTablet ? null : handleRenderSelectedMarker}
          getCollapsedNodeHeight={() => 44}
          onNodePress={handleClickTreeItem}
          itemContainerStyle={{
            ...styles.treeItemContainerStyle,
            marginHorizontal: isTablet ? 16 : 0,
          }}
          selectedContainerStyle={isTablet ? styles.itemSelect : null}
          selectedItemTitleStyle={isTablet ? styles.itemSelectTitle : null}
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
    flexDirection: 'column',
  },
  scrollView: {
    backgroundColor: getDeviceDynamicColor('drawerBackground'),
    width: '100%',
    display: 'flex',
    flex: 1,
  },
  item: {
    paddingHorizontal: 16,
    backgroundColor: getDeviceDynamicColor('drawerBackground'),
  },
  tabletItem: {
    marginHorizontal: 16,
  },
  itemContent: {
    paddingLeft: 28,
  },
  itemSelect: {
    marginHorizontal: 16,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  itemTitle: {
    color: getDeviceDynamicColor('drawerItemTitle'),
  },
  itemSelectTitle: {
    color: '#ffffff',
  },
  treeItem: {
    backgroundColor: getDeviceDynamicColor('drawerBackground'),
    marginLeft: 0,
    paddingLeft: 0,
  },
  treeItemContainerStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: getDeviceDynamicColor('drawerBackground'),
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
    marginLeft: 32,
  },
});

export default connect([
  KEYS.SELECTED_TYPE,
  KEYS.TAGS,
])(MainDrawer);

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
