import { useDynamicValue } from 'react-native-dynamic';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Header, Input, Button } from 'react-native-elements';
import i18n from 'i18n-js';
import { dynamicStyles } from './dynamicStyles';
import Icon from '../../components/icon';
import { Navigation } from '../../thirdparty/react-native-navigation';
import { getColor } from '../../config/Colors';
import dataStore, { KEYS, connect } from '../../data_store';
import { setLoginAsRoot } from '../../services/navigation';
import api from '../../api';

function AccountSettingScreen(Props) {
  const styles = useDynamicValue(dynamicStyles.styles);

  const userInfo = Props[KEYS.USER_INFO] || {};

  const [loading, setLoading] = useState(false);

  const [nickname, setNickname] = useState(userInfo.displayName);
  const [nicknameError, setNicknameError] = useState();

  const [email, setEmail] = useState(userInfo.email);
  const [emailError, setEmailError] = useState();
  const [password, setPassword] = useState();
  const [passwordError, setPasswordError] = useState();

  async function commit() {
    try {
      setLoading(true);
      if (nickname !== userInfo.displayName) {
        if (nickname.trim() === '') {
          setNicknameError(i18n.t('errorUpdateUserNameNull'));
          return;
        }
        try {
          await api.updateUserDisplayName(nickname);
        } catch (err) {
          setNicknameError(i18n.t('errorUpdateUserName'));
          throw err;
        }
      }
      if (email !== userInfo.email) {
        if (password.trim() === '') {
          setPasswordError(i18n.t('inputPasswordNullError'));
          return;
        }

        if (email.trim() === '') {
          setEmailError(i18n.t('inputUserIdNullError'));
          return;
        }

        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
          setEmailError(i18n.t('errorUserIdFormat'));
          return;
        }
        try {
          await api.changeAccount(password, userInfo.userId, email);
        } catch (err) {
          if (err.message === '31002') {
            setPasswordError(i18n.t('errorInvalidPassword'));
          } else if (err.message === '31000') {
            setEmailError(i18n.t('errorUserExists'));
          } else if (err.message === '31001') {
            setEmailError(i18n.t('errorInvalidUserId'));
          } else {
            setEmailError(i18n.t('errorModifyEmail'));
          }
          throw err;
        }

        await dataStore.logout();
        setTimeout(() => {
          setLoginAsRoot();
        }, 300);
      }
      await dataStore.initUser();
      Alert.alert(i18n.t('settingTip'), i18n.t('settingSuccess'));
    } finally {
      setLoading(false);
    }
  }

  const goBackBtn = (
    <TouchableOpacity onPress={() => {
      Navigation.pop(Props.componentId);
    }}
    >
      <Icon name="angleleft" color={getColor('settingTitleColor')} size={30} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <Header
        backgroundColor={getColor('settingBackgroundColor')}
        centerComponent={{
          text: i18n.t('settingSidebarAccount'),
          style: styles.headerTitle,
        }}
        leftComponent={goBackBtn}
      />
      <ScrollView style={styles.mainContainer}>
        <Input
          placeholder={i18n.t('settingLabelNickname')}
          label={i18n.t('settingLabelNickname')}
          value={nickname}
          onChangeText={setNickname}
          errorMessage={nicknameError}
        />
        <Input
          placeholder={i18n.t('settingLabelEmail')}
          label={i18n.t('settingLabelEmail')}
          value={email}
          onChangeText={setEmail}
          errorMessage={emailError}
        />
        {email !== userInfo.email
          ? (
            <Input
              placeholder={i18n.t('settingLabelPassword')}
              label={i18n.t('settingLabelPassword')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              errorMessage={passwordError}
            />
          ) : null}
        <Button
          title={i18n.t('settingButtonConfirm')}
          style={styles.commitBtn}
          loading={loading}
          onPress={commit}
          disabled={email === userInfo.email && nickname === userInfo.displayName}
        />
      </ScrollView>
    </View>
  );
}

export default connect([KEYS.USER_INFO])(AccountSettingScreen);
