import React, { useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18n from 'i18n-js';

import { SideMenuView } from 'react-native-navigation-drawer-extension';
import { ColorSchemeProvider, useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import { showDrawer } from '../components/MainDrawer';
import ThemedStatusBar from '../components/ThemedStatusBar';
import { updateNavigationTheme } from '../components/ThemeListener';
import { viewNote } from '../services/view_note';

import { KEYS, connect } from '../data_store';
import CategoryNoteList from '../components/CategoryNoteList';
import { getDeviceDynamicColor } from '../config/Colors';
import IapListener from '../components/IapListener';
import NoteEditor from '../components/NoteEditor';

const NotesScreen: () => React$Node = (props) => {
  //
  useEffect(() => {
    const type = props.selectedType;
    let title;
    if (type === '#allNotes') {
      title = i18n.t('itemAllNotes');
    } else if (type === '#trash') {
      title = i18n.t('itemTrash');
    } else {
      title = type;
    }
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        title: {
          text: title,
        },
      },
    });
  }, [props.selectedType]);

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
      if (buttonId === 'MainMenuButton') {
        showDrawer(props.componentId);
      }
    });
    return () => listener.remove();
  }, []);

  function handleThemeChanged(themeName) {
    updateNavigationTheme(props.componentId, themeName);
    //
    // force update buttons color
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        leftButtons: [],
      },
    });
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        leftButtons: [{
          id: 'MainMenuButton',
          // eslint-disable-next-line import/no-unresolved
          icon: require('../images/icons/menu.png'),
        }],
      },
    });
  }

  function handlePressNote() {
    viewNote(props.componentId);
  }

  const styles = useDynamicValue(dynamicStyles);

  return (
    <ColorSchemeProvider>
      <ThemedStatusBar onThemeChanged={handleThemeChanged} />
      <IapListener />
      <SafeAreaView style={styles.content}>
        <SideMenuView
          style={styles.root}
          left={showDrawer}
        >
          <View>
            <CategoryNoteList style={styles.body} showStar onPressNote={handlePressNote} />
            <NoteEditor style={styles.hiddenEditor} />
          </View>
        </SideMenuView>
      </SafeAreaView>
    </ColorSchemeProvider>
  );
};

const NotesScreenImpl = connect([KEYS.SELECTED_TYPE])(NotesScreen);

NotesScreenImpl.options = {
  topBar: {
    largeTitle: {
      visible: true,
      color: 'red',
    },
    title: {
      text: i18n.t('itemAllNotes'),
    },
    leftButtons: [{
      id: 'MainMenuButton',
      // eslint-disable-next-line import/no-unresolved
      icon: require('../images/icons/menu.png'),
    }],
  },
  sideMenu: {
    openGestureMode: 'entireScreen',
  },
};

const dynamicStyles = new DynamicStyleSheet({
  content: {
    display: 'flex',
    flex: 1,
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  body: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
    minHeight: '100%',
    flexGrow: 1,
  },
  hiddenEditor: {
    display: 'none',
  },
});

export default NotesScreenImpl;
