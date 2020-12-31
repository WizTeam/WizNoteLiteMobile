import React, { useState } from 'react';
import { SafeAreaView, Text, View, ScrollView } from 'react-native';
import { ButtonGroup, ListItem } from 'react-native-elements';
import i18n from 'i18n-js';
import { useDynamicValue } from 'react-native-dynamic';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RNNDrawer } from '../thirdparty/react-native-navigation-drawer-extension';
import { getDeviceColor, createDeviceDynamicStyles, getDeviceDynamicColor, getDynamicColor } from '../config/Colors';
import { isTablet } from '../utils/device';
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
    backgroundColor: getDynamicColor('tabBtnBackground'),

  },
  activeTab: {
    backgroundColor: getDynamicColor('tabBtnActiveBackground'),
  },
  activeTabText: {
    color: getDynamicColor('tabBtnColor'),
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  contentTree: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: getDeviceDynamicColor('drawerBackground'),
  },
  linkMainContentTree: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: getDeviceDynamicColor('drawerBackground'),
    paddingLeft: 55,
    marginTop: 5,
  },
  itemButton: {
    paddingLeft: 16,
    color: getDeviceDynamicColor('drawerItemTitle'),
  },
  treeItemTitleStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 12,
    color: getDeviceDynamicColor('drawerItemTitle'),
    paddingHorizontal: 0,
  },
  treeItemSubTitleStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 12,
    paddingHorizontal: 0,
    color: getDynamicColor('linkSubtitleColor'),
  },
  treeItemContentContainerStyle: {
    padding: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  noRes: {
    color: getDeviceDynamicColor('drawerItemTitle'),
    paddingLeft: 65,
    marginTop: 10,
  },
}));

export function NoteInfoDrawer(Props) {
  const [tab, setTab] = useState(0);
  const [linkListOpen, setLinkListOpen] = useState(true);
  const [linkedListOpen, setLinkedListOpen] = useState(true);

  const styles = useDynamicValue(dynamicStyles.styles);

  function handleRenderExpandButton({ isExpanded, hasChildrenNodes, isSelected }) {
    //
    if (!hasChildrenNodes) {
      return null;
    } else if (isExpanded) {
      return <Icon name="keyboard-arrow-down" size={24} style={styles.itemButton} />;
    }

    return <Icon name="keyboard-arrow-right" size={24} style={styles.itemButton} />;
  }

  function handleClickTreeItem({ node }) {
    Props.onContentClick(node.key);
  }

  const contentsView = Props.toc.length > 0 ? (
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
    <Text style={styles.noRes}>{ i18n.t('editorLinkedNull') }</Text>
  );

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
        {tab === 0 ? contentsView : (
          <View>
            <ListItem
              containerStyle={styles.contentTree}
              onPress={() => setLinkListOpen((open) => !open)}
              underlayColor={getDeviceColor('drawerBackground')}
            >
              {linkListOpen ? <Icon name="keyboard-arrow-down" size={24} style={styles.itemButton} /> : <Icon name="keyboard-arrow-right" size={24} style={styles.itemButton} />}
              <ListItem.Content style={styles.treeItemContentContainerStyle}>
                <ListItem.Title style={styles.treeItemTitleStyle}>
                  {i18n.t('editorLinkLabel')}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem containerStyle={styles.linkMainContentTree}>
              <ListItem.Content style={styles.treeItemContentContainerStyle}>
                <ListItem.Subtitle style={styles.treeItemSubTitleStyle}>
                  {i18n.t('editorLinkInfo')}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            {linkListOpen ? (
              <View>
                {Props.linksList.length ? Props.linksList.map((item, index) => (
                  <ListItem
                    key={index.toString()}
                    containerStyle={styles.linkMainContentTree}
                    onPress={() => {
                      Props.openNote?.(item);
                      RNNDrawer.dismissDrawer();
                    }}
                    underlayColor={getDeviceColor('drawerBackground')}
                  >
                    <ListItem.Content style={styles.treeItemContentContainerStyle}>
                      <ListItem.Title style={styles.treeItemTitleStyle}>
                        {item}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                )) : (
                  <Text style={styles.noRes}>{ i18n.t('editorLinkedNull') }</Text>
                )}
              </View>
            ) : null}
            <ListItem
              containerStyle={[styles.contentTree, {
                marginTop: 30,
              }]}
              onPress={() => setLinkedListOpen((open) => !open)}
              underlayColor={getDeviceColor('drawerBackground')}
            >
              {linkedListOpen ? <Icon name="keyboard-arrow-down" size={24} style={[styles.itemButton, styles.itemTabletButton]} /> : <Icon name="keyboard-arrow-right" size={24} style={[styles.itemButton, styles.itemTabletButton]} />}
              <ListItem.Content style={styles.treeItemContentContainerStyle}>
                <ListItem.Title style={styles.treeItemTitleStyle}>
                  {i18n.t('editorLinkedLabel')}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem containerStyle={styles.linkMainContentTree}>
              <ListItem.Content style={styles.treeItemContentContainerStyle}>
                <ListItem.Subtitle style={styles.treeItemSubTitleStyle}>
                  {i18n.t('editorLinkedInfo', { currentTitle: Props.noteTitle })}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            {linkedListOpen ? (
              <View>
                {Props.backwardLinkedNotes.length ? Props.backwardLinkedNotes.map((item, index) => (
                  <ListItem
                    key={index.toString()}
                    containerStyle={styles.linkMainContentTree}
                    onPress={() => {
                      Props.openNote?.(item);
                      RNNDrawer.dismissDrawer();
                    }}
                    underlayColor={getDeviceColor('drawerBackground')}
                  >
                    <ListItem.Content style={styles.treeItemContentContainerStyle}>
                      <ListItem.Title style={styles.treeItemTitleStyle}>
                        {item.title}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                )) : (
                  <Text style={styles.noRes}>{ i18n.t('editorLinkedNull') }</Text>
                )}
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export function showDrawer(parentComponentId, Props) {
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
        drawerScreenWidth: isTablet() ? 445 : ('80%' || 445), // Use relative to screen '%' or absolute
        drawerScreenHeight: '100%' || 700,
        style: { // Styles the drawer container, supports any react-native style
          backgroundColor: getDeviceColor('drawerBackground'),
        },
        // Custom prop, will be available in your custom drawer component props
        // eslint-disable-next-line react/prop-types
        parentComponentId,
        ...Props,
      },
    },
  });
}
