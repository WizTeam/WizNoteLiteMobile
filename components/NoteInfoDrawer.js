import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, ScrollView } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import i18n from 'i18n-js';
import { useDynamicValue } from 'react-native-dynamic';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RNNDrawer } from '../thirdparty/react-native-navigation-drawer-extension';
import { getDeviceColor, createDeviceDynamicStyles, getDeviceDynamicColor } from '../config/Colors';
import TreeView from '../thirdparty/react-native-final-tree-view';

const dynamicStyles = createDeviceDynamicStyles(() => ({
  root: {
    flex: 1,
  },
  tab: {
    width: 250,
    height: 30,
    alignSelf: 'center',
  },
  tabBtn: {
    backgroundColor: getDeviceDynamicColor('tabBtnBackground'),

  },
  activeTab: {
    backgroundColor: getDeviceDynamicColor('tabBtnActiveBackground'),
  },
  activeTabText: {
    color: getDeviceDynamicColor('tabBtnColor'),
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  contentTree: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: getDeviceColor('drawerBackground'),
  },
  itemButton: {
    paddingLeft: 16,
    color: getDeviceDynamicColor('drawerItemTitle'),
  },
  itemTabletButton: {
    color: '#ffffff',
  },
  treeItemTitleStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 12,
    color: getDeviceDynamicColor('drawerItemTitle'),
    paddingHorizontal: 0,
  },
  treeItemContentContainerStyle: {
    padding: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
}));

export function NoteInfoDrawer(Props) {
  const [tab, setTab] = useState(0);

  const styles = useDynamicValue(dynamicStyles.styles);

  useEffect(() => {
    console.log('toc', Props.toc);
  }, []);

  function handleRenderExpandButton({ isExpanded, hasChildrenNodes, isSelected }) {
    let style = styles.itemButton;
    if (isSelected) {
      style = [styles.itemButton, styles.itemTabletButton];
    }
    //
    if (!hasChildrenNodes) {
      return null;
    } else if (isExpanded) {
      return <Icon name="keyboard-arrow-down" size={24} style={style} />;
    }

    return <Icon name="keyboard-arrow-right" size={24} style={style} />;
  }

  function handleClickTreeItem({ node }) {
    Props.onContentClick(node.key);
  }

  return (
    <SafeAreaView style={styles.root}>
      <ButtonGroup
        selectedIndex={tab}
        buttons={[i18n.t('editorContents'), i18n.t('editorLink')]}
        onPress={setTab}
        containerStyle={styles.tab}
        buttonStyle={styles.tabBtn}
        selectedButtonStyle={styles.activeTab}
        selectedTextStyle={styles.activeTabText}
      />
      <ScrollView style={styles.contentTree} contentContainerStyle={styles.mainContainer}>
        {tab === 0 ? (
          <TreeView
            data={Props.toc}
            renderExpandButton={handleRenderExpandButton}
            getCollapsedNodeHeight={() => 44}
            onNodePress={handleClickTreeItem}
            itemContainerStyle={styles.contentTree}
            itemTitleStyle={styles.treeItemTitleStyle}
            itemContentContainerStyle={styles.treeItemContentContainerStyle}
            underlayColor={getDeviceColor('drawerBackground')}
          />
        ) : (
          <Text>cc</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export function showDrawer(parentComponentId, toc, onContentClick) {
  RNNDrawer.showDrawer({
    component: {
      name: 'NoteInfoDrawer',
      options: {
        statusBar: {
          drawBehind: true,
        },
      },
      passProps: {
        animationOpenTime: 300,
        animationCloseTime: 300,
        direction: 'right',
        dismissWhenTouchOutside: true,
        fadeOpacity: 0,
        drawerScreenWidth: '80%' || 445, // Use relative to screen '%' or absolute
        drawerScreenHeight: '100%' || 700,
        style: { // Styles the drawer container, supports any react-native style
          backgroundColor: getDeviceColor('drawerBackground'),
        },
        // Custom prop, will be available in your custom drawer component props
        // eslint-disable-next-line react/prop-types
        parentComponentId,
        toc,
        onContentClick,
      },
    },
  });
}
