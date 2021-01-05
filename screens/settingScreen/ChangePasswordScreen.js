import { useDynamicValue } from 'react-native-dynamic';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { Header, Input, Button } from 'react-native-elements';
import i18n from 'i18n-js';
import { dynamicStyles } from './dynamicStyles';
import Icon from '../../components/icon';
import { Navigation } from '../../thirdparty/react-native-navigation';
import { getColor } from '../../config/Colors';
import api from '../../api';
import dataStore from '../../data_store';
import { setLoginAsRoot } from '../../services/navigation';

export default function ChangePasswordScreen(Props) {
  const styles = useDynamicValue(dynamicStyles.styles);

  const [loading, setLoading] = useState(false);

  const [originPassword, setOriginPassword] = useState();
  const [originPasswordError, setOriginPasswordError] = useState();

  const [newPassword, setNewPassword] = useState();
  const [newPasswordError, setNewPasswordError] = useState();

  const [confirmPassword, setConfirmPassword] = useState();
  const [confirmPasswordError, setConfirmPasswordError] = useState();

  async function commit() {
    try {
      setLoading(true);
      if (originPassword.trim() === '') {
        setOriginPasswordError(i18n.t('errorOriginPasswordNull'));
        return;
      }
      if (originPassword.length < 6) {
        setOriginPasswordError(i18n.t('errorPasswordFormat'));
        return;
      }

      if (newPassword.trim() === '') {
        setNewPasswordError(i18n.t('errorNewPasswordNull'));
        return;
      }

      if (newPassword.length < 6) {
        setNewPasswordError(i18n.t('errorPasswordFormat'));
        return;
      }

      if (confirmPassword.trim() === '') {
        setConfirmPasswordError(i18n.t('errorConfirmPasswordNull'));
        return;
      }

      if (newPassword !== confirmPassword) {
        setConfirmPasswordError(i18n.t('errorConfirmPasswordNotSame'));
        return;
      }
      await api.changePassword(originPassword, newPassword);
      await dataStore.logout();
      setTimeout(() => {
        setLoginAsRoot();
      }, 300);
    } catch {
      setConfirmPasswordError(i18n.t('errorModifyPassword'));
    } finally {
      setLoading(false);
    }
  }

  const goBackBtn = (
    <TouchableOpacity onPress={() => {
      Navigation.dismissOverlay(Props.componentId);
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
          text: i18n.t('settingLabelModifyPassword'),
          style: styles.headerTitle,
        }}
        leftComponent={goBackBtn}
      />
      <ScrollView style={styles.mainContainer}>
        <Input
          placeholder={i18n.t('settingLabelOriginPassword')}
          label={i18n.t('settingLabelOriginPassword')}
          value={originPassword}
          onChangeText={setOriginPassword}
          errorMessage={originPasswordError}
          secureTextEntry
        />
        <Input
          placeholder={i18n.t('settingLabelNewPassword')}
          label={i18n.t('settingLabelNewPassword')}
          value={newPassword}
          onChangeText={setNewPassword}
          errorMessage={newPasswordError}
          secureTextEntry
        />
        <Input
          placeholder={i18n.t('settingLabelConfirmNewPassword')}
          label={i18n.t('settingLabelConfirmNewPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          errorMessage={confirmPasswordError}
          secureTextEntry
        />
        <Button
          title={i18n.t('settingButtonConfirm')}
          style={styles.commitBtn}
          loading={loading}
          onPress={commit}
        />
      </ScrollView>
    </View>
  );
}
