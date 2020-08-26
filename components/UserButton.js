import React, { useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import i18n from 'i18n-js';
import { Icon } from 'react-native-elements';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import { Dropdown } from '../thirdparty/react-native-material-dropdown';
import dataStore, { KEYS, connect } from '../data_store';
import { setLoginAsRoot, closeDrawer } from '../services/navigation';
import { getDynamicColor } from '../config/Colors';

const UserButton: () => React$Node = (props) => {
  const styles = useDynamicValue(dynamicStyles);

  useEffect(() => {
    dataStore.initStarredNotes();
  }, []);

  const userInfo = props[KEYS.USER_INFO] || {};
  // console.log('userInfo', userInfo);

  function handleClick() {
    if (userInfo.isLocalUser) {
      props.onLogin(userInfo);
    } else {
      props.onPressUser(userInfo);
    }
  }
  //
  const isLocalUser = userInfo.isLocalUser;
  const userActionsData = [{
    label: i18n.t('menuLogout'),
    value: 'logout',
  }];

  // eslint-disable-next-line react/prop-types
  function handleRenderDropdownBase() {
    return (
      <View style={styles.userActionDropdownBase}>
        <Text type="clear" style={styles.userActionDropdownText}>{userInfo.displayName}</Text>
        <Icon name="keyboard-arrow-down" color={styles.userActionDropdownIcon.color} />
      </View>
    );
  }

  function handleUserAction(value) {
    if (value === 'logout') {
      setTimeout(() => {
        closeDrawer();
        setTimeout(() => {
          setLoginAsRoot();
        }, 300);
      }, 300);
    }
  }
  //
  return (
    <View style={[styles.container, props.style]}>
      {isLocalUser && (
        <Button title={i18n.t('buttonLogin')} onPress={handleClick} />
      )}
      {!isLocalUser && (
        <Dropdown
          containerStyle={styles.userNameDropdown}
          label={userInfo.displayName}
          data={userActionsData}
          renderBase={handleRenderDropdownBase}
          onChangeText={handleUserAction}
          useNativeDriver
        />
      )}

    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
  },
  userNameDropdown: {
    flexGrow: 1,
    // backgroundColor: 'red',
  },
  userActionDropdownBase: {
    paddingTop: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  userActionDropdownText: {
    fontSize: 18,
    color: getDynamicColor('loginBoxText'),
  },
  userActionDropdownIcon: {
    color: getDynamicColor('loginBoxText'),
  },
});

export default connect([KEYS.USER_INFO])(UserButton);
