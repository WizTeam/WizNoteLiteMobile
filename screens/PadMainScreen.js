import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';

import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ColorSchemeProvider, DynamicValue, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import TriplePaneLayout from '../components/TriplePaneLayout';
import MainDrawer from '../components/MainDrawer';
import CategoryNoteList from '../components/CategoryNoteList';
import NoteEditor from '../components/NoteEditor';
import ThemedStatusBar from '../components/ThemedStatusBar';

const useForceUpdate = () => useState()[1];

// eslint-disable-next-line arrow-body-style
const PadMainScreen: () => React$Node = () => {
  //
  const styles = useDynamicValue(dynamicStyles);
  //
  const pane2Width = 400;
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

  //
  const forceUpdate = useForceUpdate();

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar />
      <TriplePaneLayout
        onLayout={forceUpdate}
        pane1Width={192}
        pane2Width={320}
        pane1={<MainDrawer style={styles.drawer} />}
        pane2={(
          <View style={styles.noteListContainer}>
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
    backgroundColor: new DynamicValue('rgb(216, 216, 216)', 'rgb(18, 18, 18)'),
    flex: 1,
  },
  noteListContainer: {
    flex: 1,
    backgroundColor: new DynamicValue('rgb(240, 240, 240)', 'rgb(42, 42, 42)'),
    height: '100%',
  },
  noteList: {
    flex: 1,
    height: '100%',
  },
  editorContainer: {
    backgroundColor: new DynamicValue('white', 'rgb(51, 51, 51)'),
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  editor: {
    alignSelf: 'center',
    width: 100,
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default PadMainScreenImpl;
