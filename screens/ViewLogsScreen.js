import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import { useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';

import ThemedStatusBar from '../components/ThemedStatusBar';
import { Navigation } from '../thirdparty/react-native-navigation';
import { getDeviceDynamicColor, createDeviceDynamicStyles } from '../config/Colors';
import app from '../wrapper/app';
import fs from '../wrapper/fs';

const ViewLogsScreen: () => React$Node = (props) => {
  //
  const [logs, setLogs] = useState('');
  //
  useEffect(() => {
    //
    async function loadLogs() {
      const logFileName = app.getLogFileName();
      const text = await fs.readFile(logFileName);
      setLogs(text);
    }
    //
    loadLogs();
  }, []);

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
      if (buttonId === 'CloseButton') {
        Navigation.dismissModal(props.componentId);
      }
    });
    return () => listener.remove();
  }, []);

  const styles = useDynamicValue(dynamicStyles.styles);
  //
  return (
    <>
      <ThemedStatusBar />
      <SafeAreaView style={styles.content}>
        <TextInput multiline editable={false} style={styles.text} value={logs} />
      </SafeAreaView>
    </>
  );
};

ViewLogsScreen.options = {
  topBar: {
    noBorder: true,
    title: {
      text: i18n.t('titleLogs'),
    },
    rightButtons: [{
      id: 'CloseButton',
      text: i18n.t('buttonClose'),
    }],
  },
};

const dynamicStyles = createDeviceDynamicStyles(() => ({
  content: {
    display: 'flex',
    flex: 1,
  },
  text: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
    flex: 1,
    padding: 8,
    color: getDeviceDynamicColor('noteListTitle'),
  },
}));

export default ViewLogsScreen;
