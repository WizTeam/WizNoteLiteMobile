/* eslint-disable no-param-reassign */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Header, ListItem } from 'react-native-elements';

import { RNNDrawer } from 'react-native-navigation-drawer-extension';
import Icon from 'react-native-vector-icons/MaterialIcons';

import i18n from 'i18n-js';

import TreeView from '../thirdparty/react-native-final-tree-view';
import api from '../api';

const MainDrawer: () => React$Node = () => {
  //
  function handleCloseDrawer() {
    RNNDrawer.dismissDrawer();
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

  function handleGotoAllNotes() {

  }

  function handleGotoTrash() {

  }

  function handleClickTreeItem({ node }) {
    console.log(node.id);
  }
  //
  return (
    <>
      <View>
        <Header
          barStyle="light-content"
          backgroundColor="transparent"
          containerStyle={{
            borderBottomColor: 'transparent',
          }}
          rightComponent={(
            <View style={{ marginRight: 8 }}>
              <TouchableHighlight onPress={handleCloseDrawer}>
                <View style={{
                  padding: 8,
                  paddingTop: 10,
                }}
                >
                  <Icon name="close" style={styles.icon} size={24} color="white" />
                </View>
              </TouchableHighlight>
            </View>
          )}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <ListItem title={i18n.t('itemAllNotes')} containerStyle={styles.item} titleStyle={styles.itemTitle} onPress={handleGotoAllNotes} />
          {showTrash && <ListItem title={i18n.t('itemTrash')} containerStyle={styles.item} titleStyle={styles.itemTitle} onPress={handleGotoTrash} />}

          <TreeView
            containerStyle={{
              paddingTop: 44,
            }}
            data={tags}
            renderExpandButton={handleRenderExpandButton}
            getCollapsedNodeHeight={() => 44}
            onNodePress={handleClickTreeItem}
            itemContainerStyle={styles.treeItemContainerStyle}
            itemTitleStyle={styles.treeItemTitleStyle}
            itemContentContainerStyle={styles.treeItemContentContainerStyle}
          />

        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'transparent',
    minHeight: '100%',
  },
  item: {
    backgroundColor: '#333333',
    paddingLeft: 44,
  },
  itemTitle: {
    color: 'white',
  },
  treeItem: {
    backgroundColor: '#333333',
    marginLeft: 0,
    paddingLeft: 0,
  },
  treeItemContainerStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: '#333333',
  },
  treeItemTitleStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    color: 'white',
    paddingHorizontal: 0,
  },
  treeItemContentContainerStyle: {
    padding: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
});

export default MainDrawer;
