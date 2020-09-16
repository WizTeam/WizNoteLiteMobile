import React from 'react';
import { View, Button, Text } from 'react-native';
import i18n from 'i18n-js';
import { Avatar, Icon } from 'react-native-elements';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import { Dropdown } from '../thirdparty/react-native-material-dropdown';
import dataStore, { KEYS, connect } from '../data_store';
import { setLoginAsRoot, closeDrawer } from '../services/navigation';
import { getDynamicColor } from '../config/Colors';
import api from '../api';

const UserButton: () => React$Node = (props) => {
  const styles = useDynamicValue(dynamicStyles);

  const userInfo = props[KEYS.USER_INFO] || {};

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
    const avatarUrl = api.avatarUrl;
    const name = api.displayName;
    return (
      <View style={styles.userActionDropdownBase}>
        <Avatar
          rounded
          source={{
            uri: avatarUrl,
          }}
          title={name}
        />
        <Text type="clear" style={styles.userActionDropdownText}>{userInfo.displayName}</Text>
        <Icon name="keyboard-arrow-down" color={styles.userActionDropdownIcon.color} />
      </View>
    );
  }

  function handleUserAction(value) {
    if (value === 'logout') {
      setTimeout(() => {
        dataStore.logout();
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
        <View style={styles.userActionDropdownBase}>
          <Avatar
            icon={{ name: 'user', type: 'font-awesome' }}
            rounded
            containerStyle={{
              backgroundColor: '#d8d8d8',
            }}
          />
          <Button title={i18n.t('buttonLogin')} onPress={handleClick} />
        </View>
      )}
      {!isLocalUser && (
        <Dropdown
          containerStyle={styles.userNameDropdown}
          label={userInfo.displayName}
          data={userActionsData}
          renderBase={handleRenderDropdownBase}
          onChangeText={handleUserAction}
          useNativeDriver={false}
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
    alignItems: 'center',
  },
  userActionDropdownText: {
    paddingLeft: 8,
    fontSize: 18,
    color: getDynamicColor('loginBoxText'),
  },
  userActionDropdownIcon: {
    color: getDynamicColor('loginBoxText'),
  },
});

export default connect([KEYS.USER_INFO])(UserButton);
