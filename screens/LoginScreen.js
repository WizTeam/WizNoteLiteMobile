/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import i18n from 'i18n-js';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { Dropdown } from '../thirdparty/react-native-material-dropdown';
import { setMainAsRoot } from '../services/navigation';
import api from '../api';

const LoginScreen: () => React$Node = () => {
  const [isLogin, setLogin] = useState(true);
  const [isPrivateServer, setUsePrivateServer] = useState(false);

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState('');

  const [isWorking, setWorking] = useState(false);

  const [userIdErrorMessage, setUserIdErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');

  function handleSwitchLogin() {
    setLogin(true);
  }

  function handleSwitchSignUp() {
    setLogin(false);
  }

  function handleChangeServerType(value) {
    setUsePrivateServer(value === 'private');
  }

  function handleChangeUserId(value) {
    setUserId(value);
  }

  function handleChangePassword(value) {
    setPassword(value);
  }

  function handleChangeServerUrl(value) {
    setServerUrl(value);
  }

  async function checkInput() {
    if (!userId) {
      setUserIdErrorMessage('Please enter user id');
      return false;
    }
    if (!password) {
      setPasswordErrorMessage('Please enter password');
      return false;
    }
    if (isPrivateServer) {
      if (!serverUrl) {
        setServerErrorMessage('Please enter server address');
        return false;
      }
    }
    return true;
  }

  function handleLoginError(err) {
    if (err.code === 31001) {
      //
      setUserIdErrorMessage(i18n.t('errorInvalidUserId'));
      //
    } else if (err.code === 31002) {
      //
      setPasswordErrorMessage(i18n.t('errorInvalidPassword'));
      //
    } else if (err.code === 31004 || err.code === 31005) {
      //
      setPasswordErrorMessage(i18n.t(`error${err.code}`));
      //
    } else if (err.code === 332) {
      //
      setPasswordErrorMessage(i18n.t('errorMaxTimesForIP'));
      //
    } else if (err.code === 429) {
      //
      setPasswordErrorMessage(i18n.t('errorFrequentOverflow'));
      //
    } else if (err.code === 31000) {
      //
      setUserIdErrorMessage(i18n.t('errorUserExists'));
      //
    } else if (err.code === 322) {
      //
      setUserIdErrorMessage(i18n.t('errorUserIdFormat'));
      //
    } else if (err.externCode === 'WizErrorLicenceCount' || err.externCode === 'WizErrorLicenseCount') {
      //
      setServerErrorMessage(i18n.t('errorLicenseUserLimit'));
      //
    } else if (err.externCode === 'WizErrorLicenceYear') {
      //
      setServerErrorMessage(i18n.t('errorLicenseExpired'));
      //
    } else if (err.externCode === 'WizErrorDisableRegister') {
      //
      setServerErrorMessage(i18n.t('errorDisableRegister'));
      //
    } else if (err.externCode === 'WizErrorUpdateServer') {
      //
      setServerErrorMessage(i18n.t('errorUpdateServer'));
      //
    } else if (err.externCode === 'WizErrorUnknownServerVersion') {
      //
      setServerErrorMessage(i18n.t('errorUnknownServerVersion', {
        message: err.message,
      }));
      //
    } else if (err.code === 'WizErrorNetwork') {
      //
      setUserIdErrorMessage(i18n.t('errorNetwork', {
        message: err.message,
      }));
      //
    } else if (err.isNetworkError && isPrivateServer) {
      //
      setServerErrorMessage(i18n.t(`errorServer`, { message: err.message }));
      //
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isLogin) {
        Alert.alert(err.message);
      } else {
        setPasswordErrorMessage(i18n.t('errorSignUp', { message: err.message }));
      }
    }
    //
  }

  async function handleLogin() {
    if (!checkInput()) {
      return;
    }
    //
    async function doLogin() {
      try {
        setUserIdErrorMessage('');
        setPasswordErrorMessage('');
        setServerErrorMessage('');
        setWorking(true);
        const server = isPrivateServer ? serverUrl : 'as.wiz.cn';
        await api.onlineLogin(server, userId, password);
        //
        setWorking(false);
        setMainAsRoot();
        //
      } catch (err) {
        setWorking(false);
        handleLoginError(err);
      }
    }
    //
    await doLogin();
  }

  async function handleSignUp() {
    if (!checkInput()) {
      return;
    }

    async function doSignUp() {
      try {
        setUserIdErrorMessage('');
        setPasswordErrorMessage('');
        setServerErrorMessage('');
        setWorking(true);
        const server = isPrivateServer ? serverUrl : 'as.wiz.cn';
        await api.signUp(server, userId, password);
        //
        setWorking(false);
        setMainAsRoot();
        //
      } catch (err) {
        setWorking(false);
        handleLoginError(err);
      }
    }
    //
    await doSignUp();
  }

  // eslint-disable-next-line react/prop-types
  function handleRenderDropdownBase({ value }) {
    const key = value === 'private' ? 'serverTypePrivate' : 'serverTypeDefault';
    const titleText = i18n.t(key);
    return (
      <View style={styles.serverDropdownBase}>
        <Text type="clear" style={styles.serverDropdownText}>{titleText}</Text>
        <Icon name="keyboard-arrow-down" />
      </View>
    );
  }

  const serverData = [{
    label: 'WizNote Server',
    value: 'official',
  }, {
    label: 'Private Server',
    value: 'private',
  }];

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.body}>
            <View style={styles.tab}>
              <Dropdown
                containerStyle={styles.serverDropdown}
                label="WizNote Server"
                data={serverData}
                renderBase={handleRenderDropdownBase}
                onChangeText={handleChangeServerType}
                disabled={isWorking}
              />
              <Button disabled={isWorking} type="clear" titleStyle={isLogin ? styles.selectedButton : styles.normalButton} title={i18n.t('tabLogin')} onPress={handleSwitchLogin} />
              <Button disabled={isWorking} type="clear" titleStyle={!isLogin ? styles.selectedButton : styles.normalButton} title={i18n.t('tabRegister')} onPress={handleSwitchSignUp} />

            </View>
            <View style={styles.sectionContainer}>
              <Input disabled={isWorking} placeholder={i18n.t('placeholderUserId')} errorMessage={userIdErrorMessage} onChangeText={handleChangeUserId} />
              <Input disabled={isWorking} placeholder={i18n.t('placeholderUserPassword')} errorMessage={passwordErrorMessage} secureTextEntry onChangeText={handleChangePassword} />
              {isPrivateServer && <Input disabled={isWorking} placeholder={i18n.t('placeholderPrivateServer')} errorMessage={serverErrorMessage} onChangeText={handleChangeServerUrl} />}
            </View>
            <View style={styles.sectionContainer}>
              {isLogin && <Button disabled={isWorking} title={i18n.t('buttonLogin')} onPress={handleLogin} />}
              {!isLogin && <Button disabled={isWorking} title={i18n.t('buttonSignUp')} onPress={handleSignUp} />}

            </View>
            <View style={styles.sectionContainer}>
              {isLogin && <Button type="clear" title={i18n.t('buttonForgotPassword')} onPress={handleSignUp} />}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

LoginScreen.options = {
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
    minHeight: '100%',
  },
  body: {
    backgroundColor: Colors.white,
    minHeight: '100%',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  normalButton: {

  },
  selectedButton: {
    fontSize: 24,
    fontWeight: '600',
  },
  serverDropdown: {
    minWidth: 200,
    flexGrow: 1,
  },
  serverDropdownBase: {
    paddingTop: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  serverDropdownText: {
    fontSize: 18,
  },
});

export default LoginScreen;
