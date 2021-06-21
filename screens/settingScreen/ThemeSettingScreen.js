import { useDynamicValue } from 'react-native-dynamic';
import { View, TouchableOpacity, ScrollView, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Header, ListItem } from 'react-native-elements';
import i18n from 'i18n-js';
import { dynamicStyles } from './dynamicStyles';
import Icon from '../../components/icon';
import { Navigation } from '../../thirdparty/react-native-navigation';
import { getColor } from '../../config/Colors';
import { KEYS, connect } from '../../data_store';
import { openScreen } from '../../services/navigation';
import api from '../../api';
import app from '../../wrapper/app';
import WizSingletonWebView, { injectJavaScript } from '../../components/WizSingletonWebView';

const resPath = app.getPath('res');

function ThemeSettingScreen(Props) {
  const styles = useDynamicValue(dynamicStyles.styles);
  // const webRef = useRef();
  const [isDark, setIsDark] = useState(false);
  const [isLoadEnd, setIsLoadEnd] = useState(false);

  const settingInfo = Props[KEYS.USER_SETTING] || {};

  const goBackBtn = (
    <TouchableOpacity onPress={() => {
      Navigation.pop(Props.componentId);
    }}
    >
      <Icon name="angleleft" color={getColor('settingTitleColor')} size={30} />
    </TouchableOpacity>
  );

  async function checkTheme() {
    if (isDark !== undefined) {
      const newTheme = [];
      //
      if (settingInfo.colorTheme) {
        newTheme.push(settingInfo.colorTheme);
      }
      if (isDark) {
        newTheme.push('dark');
      } else {
        newTheme.push('lite');
      }
      //
      const css = await api.getThemeCssString(newTheme.join('.'));
      // webRef.current.injectJavaScript(`checkTheme(${JSON.stringify(css)});true;`);
      injectJavaScript(`checkTheme(${JSON.stringify(css)});true;`);
    }
  }

  useEffect(() => {
    if (isLoadEnd) {
      checkTheme();
    }
  }, [isDark, settingInfo.colorTheme, isLoadEnd]);

  useEffect(() => {
    (async () => {
      const md = await api.getDefaultMarkdown();
      injectJavaScript(`setEditorViewerMarkdown(${JSON.stringify(md)});true;`);
      setIsLoadEnd(true);
    })();
  }, []);

  // const loadDefaultMarkdown = useCallback(async () => {
  //   const md = await api.getDefaultMarkdown();
  //   webRef.current.injectJavaScript(`setMarkdown(${JSON.stringify(md)});true;`);
  //   setIsLoadEnd(true);
  // }, []);

  return (
    <View style={styles.root}>
      <Header
        backgroundColor={getColor('settingBackgroundColor')}
        centerComponent={{
          text: i18n.t('settingSidebarTheme'),
          style: styles.headerTitle,
        }}
        leftComponent={goBackBtn}
      />
      <ScrollView>
        <View style={styles.mainContainer}>
          <Text style={styles.editorViewerLabel}>{i18n.t('settingLabelPreviewTheme')}</Text>
          {/* <WebView source={{ uri: `file://${resPath}/build/index.html?type=viewer` }} style={styles.editorViewer} ref={webRef} onLoadEnd={loadDefaultMarkdown} /> */}
          {/* <WebView source={{ uri: 'http://localhost:3000?type=viewer' }} style={styles.editorViewer} ref={webRef} onLoadEnd={loadDefaultMarkdown} /> */}
          <WizSingletonWebView style={styles.editorViewer} />
        </View>
        <View style={styles.lists}>
          <ListItem onPress={() => openScreen(Props.parentComponentId, 'ThemeChooseScreen')}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title>{i18n.t('settingLabelChooseTheme')}</ListItem.Title>
            </ListItem.Content>
            <Text style={styles.listValue}>{settingInfo.colorTheme}</Text>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
          <ListItem
            leftElement={(
              <ListItem.Content style={styles.listLabel}>
                <ListItem.Title>{i18n.t('settingLabelDarkMode')}</ListItem.Title>
              </ListItem.Content>
            )}
            switch={{
              value: isDark,
              onValueChange: setIsDark,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default connect([KEYS.USER_SETTING])(ThemeSettingScreen);
