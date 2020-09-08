import React, { useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { Header } from 'react-native-elements';

import TriplePaneLayout, { STATE as OPEN_STATE } from '../components/TriplePaneLayout';
import { gestureHandlerRootHOC } from '../thirdparty/react-native-gesture-handler';
import MainDrawer from '../components/MainDrawer';
import CategoryNoteList from '../components/CategoryNoteList';
import NoteEditor from '../components/NoteEditor';
import ThemedStatusBar from '../components/ThemedStatusBar';
import { getDeviceDynamicColor, getDeviceColor } from '../config/Colors';
import { createNewNote } from '../services/new_note';

const useForceUpdate = () => useState()[1];

// eslint-disable-next-line arrow-body-style
const PadMainScreen: () => React$Node = () => {
  //
  const layoutRef = useRef(null);
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

  function handleCreateNote() {
    createNewNote();
  }

  function handleToggleMenu() {
    //
    const openState = layoutRef.current.currentOpenState();
    if (openState === OPEN_STATE.openAll) {
      layoutRef.current.toggleOpenState(OPEN_STATE.open2);
    } else {
      layoutRef.current.toggleOpenState(OPEN_STATE.openAll);
    }
  }

  function handleGetExcludeRegions(state) {
    //
    let excludeRegions;
    if (state === OPEN_STATE.open2) {
      excludeRegions = [{
        x: 0,
        y: 60,
        width: pane2Width,
        height: screenHeight - 60,
      }];
    } else if (state === OPEN_STATE.openAll) {
      excludeRegions = [{
        x: pane1Width,
        y: 60,
        width: pane2Width,
        height: screenHeight - 60,
      }];
    }
    return excludeRegions;
  }

  //
  const forceUpdate = useForceUpdate();

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar />
      <TriplePaneLayout
        ref={layoutRef}
        onGetExcludeRegions={handleGetExcludeRegions}
        onLayout={forceUpdate}
        pane1Width={pane1Width}
        pane2Width={pane2Width}
        pane1={<MainDrawer style={styles.drawer} />}
        pane2={(
          <View style={styles.noteListContainer}>
            <Header
              containerStyle={styles.listHeader}
              leftComponent={{
                icon: 'menu',
                onPress: handleToggleMenu,
                style: styles.headerButton,
                color: getDeviceColor('noteListTitle'),
              }}
              rightComponent={{
                icon: 'add',
                onPress: handleCreateNote,
                style: styles.headerButton,
                color: getDeviceColor('noteListTitle'),
              }}
            />
            <CategoryNoteList style={styles.noteList} />
          </View>
        )}
        pane3={(
          <NoteEditor
            containerStyle={styles.editorContainer}
            editorStyle={editorStyle}
          />
        )}
      />
    </ColorSchemeProvider>
  );
};

const PadMainScreenImpl = gestureHandlerRootHOC(PadMainScreen);

PadMainScreenImpl.options = {
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
});

export default PadMainScreenImpl;
