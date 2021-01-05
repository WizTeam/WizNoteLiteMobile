import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import { Avatar, Button } from 'react-native-elements';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import { KEYS, connect } from '../data_store';
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
      <TouchableOpacity style={styles.userActionDropdownBase} onPress={props.onSetting}>
        <Avatar
          rounded
          source={{
            uri: avatarUrl,
          }}
          title={name}
        />
        <Text type="clear" style={styles.userActionDropdownText}>{userInfo.displayName}</Text>
      </TouchableOpacity>
    );
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
          <Button type="clear" title={i18n.t('buttonLogin')} onPress={handleClick} />
        </View>
      )}
      {/* {!isLocalUser && (
        <Dropdown
          containerStyle={styles.userNameDropdown}
          itemContainerStyle={styles.dropdownItem}
          pickerStyle={styles.picker}
          label={userInfo.displayName}
          data={userActionsData}
          renderBase={handleRenderDropdownBase}
          onChangeText={handleUserAction}
          useNativeDriver={false}
          dropdownOffset={{
            top: 64,
            left: 12,
          }}
        />
      )} */}
      {!isLocalUser && handleRenderDropdownBase()}

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
  picker: {
    backgroundColor: getDynamicColor('dropdownPickerBackground'),
    borderRadius: 4,
    maxWidth: 200,
  },
  dropdownItem: {
    paddingLeft: 32,
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
