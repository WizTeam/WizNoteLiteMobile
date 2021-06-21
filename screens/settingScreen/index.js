import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import i18n from 'i18n-js';

import { Header, Button, ListItem } from 'react-native-elements';
import { useDynamicValue } from 'react-native-dynamic';
import moment from 'moment';
import { Navigation } from '../../thirdparty/react-native-navigation';
import { getColor } from '../../config/Colors';
import { setLoginAsRoot, openScreen, showUpgradeViDialog } from '../../services/navigation';
import dataStore, { KEYS, connect } from '../../data_store';
import { dynamicStyles } from './dynamicStyles';

import Icon from '../../components/icon';

function SettingScreen(Props) {
  const styles = useDynamicValue(dynamicStyles.styles);
  const goBackBtn = (
    <TouchableOpacity onPress={() => {
      Navigation.pop(Props.componentId);
    }}
    >
      <Icon name="angleleft" color={getColor('settingTitleColor')} size={30} />
    </TouchableOpacity>
  );

  function handleUserAction() {
    setTimeout(() => {
      dataStore.logout();
      Navigation.pop(Props.componentId);
      setTimeout(() => {
        setLoginAsRoot();
      }, 300);
    }, 300);
  }

  const userInfo = Props[KEYS.USER_INFO] || {};
  const settingInfo = Props[KEYS.USER_SETTING] || {};
  return (
    <View style={styles.root}>
      <Header
        backgroundColor={getColor('settingBackgroundColor')}
        centerComponent={{
          text: i18n.t('editorSetting'),
          style: styles.headerTitle,
        }}
        leftComponent={goBackBtn}
      />
      <ScrollView>
        {userInfo.vip ? (
          <View style={styles.user}>
            <Icon name="wangguan" size={40} />
            <Text style={styles.vipTime}>{i18n.t('vipExpiredTime', { time: moment(userInfo.vipDate).format('YYYY-MM-DD') })}</Text>
          </View>
        ) : null}
        <Button title={i18n.t(userInfo.vip ? 'buttonUpgradeVIPWithPrice' : 'buttonUpgradeVIPWithPrice')} style={styles.vipBtn} onPress={() => showUpgradeViDialog()} />

        <View style={styles.lists}>
          <Text style={styles.listName}>{i18n.t('settingSidebarAccount')}</Text>
          <ListItem bottomDivider onPress={() => openScreen(Props.parentComponentId, 'AccountSettingScreen')} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{userInfo.displayName}</ListItem.Title>
            </ListItem.Content>
            <Text style={styles.listValue}>{userInfo.email}</Text>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
          <ListItem onPress={() => openScreen(Props.parentComponentId, 'ChangePasswordScreen')} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{i18n.t('settingLabelModifyPassword')}</ListItem.Title>
            </ListItem.Content>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
        </View>

        <View style={styles.lists}>
          <Text style={styles.listName}>{i18n.t('settingSidebarTheme')}</Text>
          <ListItem onPress={() => openScreen(Props.parentComponentId, 'ThemeSettingScreen')} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{i18n.t('settingSidebarTheme')}</ListItem.Title>
            </ListItem.Content>
            <Text style={styles.listValue}>{settingInfo.colorTheme}</Text>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
        </View>

        <View style={styles.lists}>
          <Text style={styles.listName}>{i18n.t('settingSidebarEdit')}</Text>
          <ListItem bottomDivider onPress={() => openScreen(Props.parentComponentId, 'TextStyleSettingScreen', { type: 'fontSize' })} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{i18n.t('settingLabelFontSize')}</ListItem.Title>
            </ListItem.Content>
            <Text style={styles.listValue}>{settingInfo.editorConfig.fontSize}</Text>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
          <ListItem bottomDivider onPress={() => openScreen(Props.parentComponentId, 'TextStyleSettingScreen', { type: 'lineHeight' })} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{i18n.t('settingLabelLineHeight')}</ListItem.Title>
            </ListItem.Content>
            <Text style={styles.listValue}>{settingInfo.editorConfig.lineHeight}</Text>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
          <ListItem bottomDivider onPress={() => openScreen(Props.parentComponentId, 'TextStyleSettingScreen', { type: 'fontFamily' })} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{i18n.t('settingLabelFontFamily')}</ListItem.Title>
            </ListItem.Content>
            <Text style={styles.listValue}>{settingInfo.editorConfig.fontFamily}</Text>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
          <ListItem onPress={() => openScreen(Props.parentComponentId, 'TextStyleSettingScreen', { type: 'paragraphHeight' })} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{i18n.t('settingLabelParagraphHeight')}</ListItem.Title>
            </ListItem.Content>
            <Text style={styles.listValue}>{settingInfo.editorConfig.paragraphHeight}</Text>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
        </View>

        <View style={styles.lists}>
          <Text style={styles.listName}>{i18n.t('settingOtherLabel')}</Text>
          <ListItem onPress={() => Linking.openURL('https://support.qq.com/product/174045')} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{i18n.t('feedback')}</ListItem.Title>
            </ListItem.Content>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
          <ListItem onPress={() => Linking.openURL('https://url.wiz.cn/u/LiteManual')} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={styles.listLabelText}>{i18n.t('helpBook')}</ListItem.Title>
            </ListItem.Content>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
        </View>

        <View style={styles.lists}>
          <ListItem onPress={handleUserAction} containerStyle={styles.listContainer}>
            <ListItem.Content style={styles.listLabel}>
              <ListItem.Title style={{ color: getColor('settingMainColor') }}>{i18n.t('menuLogout')}</ListItem.Title>
            </ListItem.Content>
            <Icon name="angle-right" color={getColor('settingFontColor')} size={18} />
          </ListItem>
        </View>

      </ScrollView>
    </View>
  );
}

export default connect([KEYS.USER_INFO, KEYS.USER_SETTING])(SettingScreen);
