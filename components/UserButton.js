import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import i18n from 'i18n-js';

import dataStore, { KEYS, connect } from '../data_store';

const UserButton: () => React$Node = (props) => {
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
  const buttonTitle = userInfo.isLocalUser
    ? i18n.t('buttonLogin')
    : (userInfo.displayName || '');
  //
  return (
    <View style={[styles.container, props.style]}>
      <Button title={buttonTitle} onPress={handleClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
  },
});

export default connect([KEYS.USER_INFO])(UserButton);
