import { useDynamicValue } from 'react-native-dynamic';
import { View, TouchableOpacity, ScrollView, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Header, ListItem, Slider } from 'react-native-elements';
import i18n from 'i18n-js';
import { WebView } from 'react-native-webview';
import { dynamicStyles } from './dynamicStyles';
import Icon from '../../components/icon';
import { Navigation } from '../../thirdparty/react-native-navigation';
import { getColor } from '../../config/Colors';
import dataStore, { KEYS, connect } from '../../data_store';
import api from '../../api';
import app from '../../wrapper/app';

const resPath = app.getPath('res');

const fontFamilyOptions = [
  { title: 'Open Sans', value: 'Open Sans' },
  { title: 'WenQuanYi Micro Hei', value: 'WenQuanYi Micro Hei' },
  { title: 'sans-serif', value: 'sans-serif' },
];

function TextStyleSettingScreen(Props) {
  const styles = useDynamicValue(dynamicStyles.styles);
  const webRef = useRef();
  const settingInfo = Props[KEYS.USER_SETTING] || {};

  const goBackBtn = (
    <TouchableOpacity onPress={() => {
      Navigation.pop(Props.componentId);
    }}
    >
      <Icon name="angleleft" color={getColor('settingTitleColor')} size={30} />
    </TouchableOpacity>
  );

  useEffect(() => {
    async function loadDefaultMarkdown() {
      const md = await api.getDefaultMarkdown();
      setTimeout(() => {
        webRef.current.injectJavaScript(`setMarkdown(${JSON.stringify(md)});true;`);
        webRef.current.injectJavaScript(`setEditorTextStyle(${JSON.stringify(settingInfo.editorConfig)});true;`);
      }, 1000);
    }
    loadDefaultMarkdown();
  }, []);

  function handleEditorStyleChange(type, val) {
    dataStore.setUserSettings('editorConfig', Object.assign({}, settingInfo.editorConfig, { [type]: val }));
    webRef.current.injectJavaScript(`setEditorTextStyle(${JSON.stringify(settingInfo.editorConfig)});true;`);
  }

  return (
    <View style={styles.root}>
      <Header
        backgroundColor={getColor('settingBackgroundColor')}
        centerComponent={{
          text: i18n.t('settingSidebarEdit'),
          style: styles.headerTitle,
        }}
        leftComponent={goBackBtn}
      />
      <ScrollView>
        <View style={styles.mainContainer}>
          <WebView source={{ uri: `file://${resPath}/build/index.html?type=viewer` }} style={styles.editorViewer} ref={webRef} />
          {/* <WebView source={{ uri: 'http://localhost:3000?type=viewer' }} style={styles.editorViewer} ref={webRef} /> */}
        </View>

        {Props.type === 'fontSize' ? (
          <View style={styles.lists}>
            <Text style={styles.listName}>{i18n.t('settingLabelFontSize')}</Text>
            <ListItem
              leftElement={(
                <Slider
                  animateTransitions
                  minimumValue={12}
                  maximumValue={20}
                  step={2}
                  value={settingInfo.editorConfig.fontSize}
                  onValueChange={(val) => handleEditorStyleChange('fontSize', val)}
                  style={{
                    flex: 1,
                  }}
                />
            )}
              rightElement={(
                <Text>{`${settingInfo.editorConfig.fontSize}px`}</Text>
            )}
            />
          </View>
        ) : null}

        {Props.type === 'lineHeight' ? (
          <View style={styles.lists}>
            <Text style={styles.listName}>{i18n.t('settingLabelLineHeight')}</Text>
            <ListItem
              leftElement={(
                <Slider
                  animateTransitions
                  minimumValue={1.3}
                  maximumValue={2}
                  step={0.1}
                  value={settingInfo.editorConfig.lineHeight}
                  onValueChange={(val) => handleEditorStyleChange('lineHeight', val.toFixed(1))}
                  style={{
                    flex: 1,
                  }}
                />
            )}
              rightElement={(
                <Text>{settingInfo.editorConfig.lineHeight}</Text>
            )}
            />
          </View>
        ) : null}

        {Props.type === 'paragraphHeight' ? (
          <View style={styles.lists}>
            <Text style={styles.listName}>{i18n.t('settingLabelParagraphHeight')}</Text>
            <ListItem
              leftElement={(
                <Slider
                  animateTransitions
                  minimumValue={5}
                  maximumValue={20}
                  step={5}
                  value={settingInfo.editorConfig.paragraphHeight}
                  onValueChange={(val) => handleEditorStyleChange('paragraphHeight', val)}
                  style={{
                    flex: 1,
                  }}
                />
            )}
              rightElement={(
                <Text>{settingInfo.editorConfig.paragraphHeight}</Text>
            )}
            />
          </View>
        ) : null}

        {Props.type === 'fontFamily' ? (
          <View style={styles.lists}>
            <Text style={styles.listName}>{i18n.t('settingLabelFontFamily')}</Text>
            {fontFamilyOptions.map((item) => (
              <ListItem
                leftElement={(
                  <ListItem.Content style={styles.listLabel}>
                    <ListItem.Title>{item.title}</ListItem.Title>
                  </ListItem.Content>
              )}
                checkBox={{
                  checked: settingInfo.editorConfig.fontFamily === item.value,
                  onPress: () => handleEditorStyleChange('fontFamily', item.value),
                }}
                key={item.value}
                onPress={() => handleEditorStyleChange('fontFamily', item.value)}
              />
            ))}
          </View>
        ) : null}

      </ScrollView>
    </View>
  );
}

export default connect([KEYS.USER_SETTING])(TextStyleSettingScreen);
