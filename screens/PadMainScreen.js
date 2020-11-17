import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import Icon from '../components/icon';

import TriplePaneLayout, { STATE as OPEN_STATE } from '../components/TriplePaneLayout';
import { gestureHandlerRootHOC } from '../thirdparty/react-native-gesture-handler';
import MainDrawer from '../components/MainDrawer';
import PadNoteList from '../components/PadNoteList';
import NoteEditor from '../components/NoteEditor';
import ThemedStatusBar from '../components/ThemedStatusBar';
import { getDeviceDynamicColor, getDeviceColor } from '../config/Colors';
import api from '../api';
import RootView from '../components/RootView';
import EditorToolBar from '../components/EditorToolbar';
import { showPrivacyPolicy } from '../services/privacy_policy';

const useForceUpdate = () => useState()[1];

const PadMainScreen: () => React$Node = () => {
  //
  const layoutRef = useRef(null);
  const toolbarRef = useRef(null);
  const editorRef = useRef(null);
  //
  const styles = useDynamicValue(dynamicStyles);
  //
  const pane1Width = 288;
  const pane2Width = 368;
  //
  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);
  const windowWidth = Math.max(screenWidth, screenHeight);
  //
  const isLandscape = screenWidth > screenHeight;

  const editorMaxWidth = isLandscape
    ? Math.min(Math.min(screenWidth, screenHeight), windowWidth - pane2Width)
    : screenWidth;
  //
  const editorStyle = {
    ...styles.editor,
    width: editorMaxWidth,
  };

  function handleToggleMenu() {
    //
    const openState = layoutRef.current.currentOpenState();
    if (openState === OPEN_STATE.openAll) {
      layoutRef.current.toggleOpenState(OPEN_STATE.open2);
      api.setSettings('triplePaneOpenState', OPEN_STATE.open2);
    } else {
      layoutRef.current.toggleOpenState(OPEN_STATE.openAll);
      api.setSettings('triplePaneOpenState', OPEN_STATE.openAll);
    }
  }

  function handleGetExcludeRegions(state) {
    //
    const topHeight = 180;
    //
    let excludeRegions;
    if (state === OPEN_STATE.open2) {
      excludeRegions = [{
        x: 0,
        y: topHeight,
        width: pane2Width,
        height: screenHeight - topHeight,
        exceptionClassNames: Platform.OS === 'ios' ? ['RCTCustomScrollView'] : ['ReactScrollView'],
        state: 2,
      }];
    } else if (state === OPEN_STATE.openAll) {
      excludeRegions = [{
        x: pane1Width,
        y: topHeight,
        width: pane2Width,
        height: screenHeight - topHeight,
        exceptionClassNames: Platform.OS === 'ios' ? ['RCTCustomScrollView'] : ['ReactScrollView'],
        state: 3,
      }];
    }
    return excludeRegions;
  }
  function handleBeginEditing({ keyboardHeight, animationDuration }) {
    const layout = layoutRef.current;
    const openState = layout.currentOpenState();
    if (isLandscape) {
      if (openState === OPEN_STATE.openAll) {
        layoutRef.current.toggleOpenState(OPEN_STATE.open2);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (openState !== OPEN_STATE.closeAll) {
        // layoutRef.current.toggleOpenState(OPEN_STATE.closeAll);
      }
    }
    toolbarRef.current.show(true, keyboardHeight, animationDuration);
  }

  function handleEndEditing({ animationDuration }) {
    toolbarRef.current.hide(true, animationDuration);
  }

  useEffect(() => {
    toolbarRef.current.setEditor(editorRef.current);
  }, []);

  //
  const forceUpdate = useForceUpdate();
  //
  useEffect(() => {
    showPrivacyPolicy();
  }, []);

  //
  return (
    <ColorSchemeProvider>
      <ThemedStatusBar />
      <RootView>
        <TriplePaneLayout
          ref={layoutRef}
          onGetExcludeRegions={handleGetExcludeRegions}
          onLayout={forceUpdate}
          pane1Width={pane1Width}
          pane2Width={pane2Width}
          pane1={<MainDrawer style={styles.drawer} />}
          pane2={(
            <PadNoteList
              onToggleMenu={handleToggleMenu}
            />
          )}
          pane3={(
            <View style={styles.editorContainer}>
              <View style={styles.toolbarBlock}>
                <TouchableOpacity style={styles.toolbarBlockBtn} onPress={() => editorRef.current?.executeCommand('undo')}>
                  <Icon size={30} name="revoke" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarBlockBtn} onPress={() => editorRef.current?.executeCommand('redo')}>
                  <Icon size={38} name="redo" />
                </TouchableOpacity>
              </View>
              <NoteEditor
                containerStyle={styles.editorContainer}
                editorStyle={editorStyle}
                onBeginEditing={handleBeginEditing}
                onEndEditing={handleEndEditing}
                onChangeSelection={(status) => toolbarRef.current?.changeToolbarType(status)}
                ref={editorRef}
              />
            </View>
          )}
        />
        <EditorToolBar ref={toolbarRef} />
      </RootView>
    </ColorSchemeProvider>
  );
};

const PadMainScreenImpl = gestureHandlerRootHOC(PadMainScreen);

PadMainScreenImpl.options = {
  layout: {
    componentBackgroundColor: getDeviceColor('rootBackground'),
  },
  statusBar: {
    translucent: false,
    drawBehind: true,
    backgroundColor: 'transparent',
  },
  topBar: {
    visible: false,
  },
};

const dynamicStyles = new DynamicStyleSheet({
  drawer: {
    backgroundColor: getDeviceDynamicColor('drawerBackground'),
    flex: 1,
  },
  noteListContainer: {
    flex: 1,
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
    height: '100%',
  },
  noteList: {
    flex: 1,
    height: '100%',
  },
  title: {
    paddingLeft: 18,
    color: getDeviceDynamicColor('noteListTitle'),
  },
  listHeader: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  headerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editorContainer: {
    backgroundColor: getDeviceDynamicColor('noteBackground'),
    width: '100%',
    height: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  editor: {
    alignSelf: 'center',
    height: '100%',
    backgroundColor: getDeviceDynamicColor('noteBackground'),
  },
  searchBarContainerStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  searchBarInputContainerStyle: {
    backgroundColor: getDeviceDynamicColor('searchBarBackground'),
  },
  toolbarBlock: {
    position: 'absolute',
    right: 30,
    top: 30,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarBlockBtn: {
    marginLeft: 30,
  },
});

export default PadMainScreenImpl;
