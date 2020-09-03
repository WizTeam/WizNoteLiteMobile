import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  ImageBackground,
  TouchableHighlight,
  Linking,
} from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import i18n from 'i18n-js';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { DynamicValue, useDynamicValue, DynamicStyleSheet, useDarkMode } from 'react-native-dynamic';

import { Navigation } from '../thirdparty/react-native-navigation';
import { Dropdown } from '../thirdparty/react-native-material-dropdown';
import { setMainAsRoot } from '../services/navigation';
import { getDynamicColor } from '../config/Colors';
import api from '../api';
import dataStore from '../data_store';
import { isTablet } from '../utils/device';

import ThemedStatusBar from '../components/ThemedStatusBar';
import LoginBannerLight from '../components/svg/LoginBannerLight';
import LoginBannerDark from '../components/svg/LoginBannerDark';

const loginBanner = new DynamicValue(LoginBannerLight, LoginBannerDark);

const LoginScreen: () => React$Node = (props) => {
  const styles = useDynamicValue(dynamicStyles);
  const isDarkMode = useDarkMode();
  const Banner = useDynamicValue(loginBanner);

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

  function shouldMergeAccount() {
    return api.isLoggedIn() && api.user.isLocalUser;
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
        await api.onlineLogin(server, userId, password, {
          autoLogin: true,
          mergeLocalAccount: shouldMergeAccount(),
        });
        //
        await dataStore.initUser();
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
        await api.signUp(server, userId, password, {
          autoLogin: true,
          mergeLocalAccount: shouldMergeAccount(),
        });
        //
        await dataStore.initUser();
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

  function handleCloseLogin() {
    if (props.closable) {
      Navigation.dismissModal(props.componentId);
    } else {
      setMainAsRoot();
    }
  }

  function handleForgotPassword() {
    Linking.openURL('https://www.wiz.cn/login#forgot');
  }

  // eslint-disable-next-line react/prop-types
  function handleRenderDropdownBase({ value }) {
    const key = value === 'private' ? 'serverTypePrivate' : 'serverTypeDefault';
    const titleText = i18n.t(key);
    return (
      <View style={styles.serverDropdownBase}>
        <Text type="clear" style={styles.serverDropdownText}>{titleText}</Text>
        <Icon name="keyboard-arrow-down" color={styles.serverDropdownIcon.color} />
      </View>
    );
  }

  const serverData = [{
    label: i18n.t('serverTypeDefault'),
    value: 'official',
  }, {
    label: i18n.t('serverTypePrivate'),
    value: 'private',
  }];

  const backgroundSource = isDarkMode
    // eslint-disable-next-line import/no-unresolved
    ? require('../images/background/bg_night.png')
    // eslint-disable-next-line import/no-unresolved
    : require('../images/background/bg.png');

  //
  return (
    <>
      <ThemedStatusBar />
      <ImageBackground
        source={backgroundSource}
        style={styles.image}
      >
        <SafeAreaView>
          <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            {!isTablet && props.closable && (
              <TouchableHighlight style={styles.closeTouchable} onPress={handleCloseLogin}>
                <Icon name="close" color={styles.serverDropdownIcon.color} size={24} />
              </TouchableHighlight>
            )}
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainerStyle}
          >
            <View style={styles.body}>
              <Banner style={styles.title} />
              <View style={styles.shadowBox}>
                <View style={styles.tab}>
                  <Button disabled={isWorking} type="clear" titleStyle={isLogin ? styles.selectedButton : styles.normalButton} title={i18n.t('tabLogin')} onPress={handleSwitchLogin} />
                  <Button disabled={isWorking} type="clear" titleStyle={!isLogin ? styles.selectedButton : styles.normalButton} title={i18n.t('tabRegister')} onPress={handleSwitchSignUp} />
                </View>
                <Dropdown
                  containerStyle={styles.serverDropdown}
                  pickerStyle={styles.serverPicker}
                  itemColor={styles.serverPickerItem.color}
                  selectedItemColor={styles.serverPickerItemSelected.color}
                  label="WizNote Server"
                  data={serverData}
                  value={isPrivateServer ? 'private' : 'official'}
                  renderBase={handleRenderDropdownBase}
                  onChangeText={handleChangeServerType}
                  disabled={isWorking}
                  useNativeDriver
                />
                <View style={styles.sectionContainer}>
                  <Input
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.input}
                    inputStyle={styles.inputElement}
                    disabled={isWorking}
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    placeholder={i18n.t('placeholderUserId')}
                    errorMessage={userIdErrorMessage}
                    onChangeText={handleChangeUserId}
                  />
                  <Input
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.input}
                    inputStyle={styles.inputElement}
                    disabled={isWorking}
                    textContentType="password"
                    placeholder={i18n.t('placeholderUserPassword')}
                    errorMessage={passwordErrorMessage}
                    secureTextEntry
                    onChangeText={handleChangePassword}
                  />
                  {isPrivateServer && (
                    <Input
                      containerStyle={styles.inputContainer}
                      inputContainerStyle={styles.input}
                      inputStyle={styles.inputElement}
                      disabled={isWorking}
                      placeholder={i18n.t('placeholderPrivateServer')}
                      errorMessage={serverErrorMessage}
                      onChangeText={handleChangeServerUrl}
                    />
                  )}
                </View>
                <View style={[styles.sectionContainer, styles.buttonBox]}>
                  {isLogin && <Button disabledStyle={styles.button} buttonStyle={styles.button} loading={isWorking} disabled={isWorking} title={i18n.t('buttonLogin')} onPress={handleLogin} />}
                  {!isLogin && <Button disabledStyle={styles.button} buttonStyle={styles.button} loading={isWorking} disabled={isWorking} title={i18n.t('buttonSignUp')} onPress={handleSignUp} />}
                </View>
                <View style={styles.sectionContainer}>
                  {isLogin && <Button titleStyle={styles.forgotButton} type="clear" title={i18n.t('buttonForgotPassword')} onPress={handleForgotPassword} />}
                </View>
              </View>
              <Text style={styles.declare}>
                By Signing in, you agree the Terms of Service and Privacy Policy
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

LoginScreen.options = {
  topBar: {
    visible: false,
  },
};

const dynamicStyles = new DynamicStyleSheet({
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  scrollView: {
    minHeight: '100%',
  },
  contentContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  body: {
    maxWidth: 350,
    minHeight: '100%',
  },
  title: {
    marginTop: 35,
  },
  closeTouchable: {
    padding: 8,
    marginRight: 8,
  },
  shadowBox: {
    marginTop: 40,
    marginHorizontal: 12,
    paddingBottom: 55,
    borderRadius: 10,
    backgroundColor: getDynamicColor('loginBoxBackground'),
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 32,
  },
  buttonBox: {
    marginTop: 16,
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
    paddingTop: 32,
  },
  normalButton: {
    color: getDynamicColor('loginBoxText'),
    fontSize: 16,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  input: {
    backgroundColor: getDynamicColor('loginBoxInputBackground'),
    borderBottomWidth: 0,
    borderRadius: 2,
    paddingHorizontal: 9,
  },
  inputElement: {
    color: getDynamicColor('loginBoxText'),
  },
  selectedButton: {
    fontSize: 24,
    fontWeight: '600',
    color: getDynamicColor('loginBoxText'),
  },
  serverDropdown: {
    // minWidth: 200,
    // flexGrow: 1,
    paddingHorizontal: 32,
    marginTop: 32,
  },
  serverPicker: {
    backgroundColor: getDynamicColor('dropdownPickerBackground'),
  },
  serverPickerItem: {
    color: getDynamicColor('dropdownPickerItemColor'),
  },
  serverPickerItemSelected: {
    color: getDynamicColor('dropdownPickerItemSelectedColor'),
  },
  serverDropdownIcon: {
    color: getDynamicColor('loginBoxText'),
  },
  serverDropdownBase: {
    paddingTop: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  serverDropdownText: {
    fontSize: 18,
    color: getDynamicColor('loginBoxText'),
  },
  declare: {
    marginTop: 80,
    fontSize: 12,
    lineHeight: 22,
    color: getDynamicColor('loginBoxText2'),
    textAlign: 'center',
    paddingHorizontal: 68,
  },
  button: {
    backgroundColor: getDynamicColor('loginBoxButtonBackground'),
    color: '#ffffff',
  },
  forgotButton: {
    color: getDynamicColor('loginBoxText2'),
  },
});

export default LoginScreen;
