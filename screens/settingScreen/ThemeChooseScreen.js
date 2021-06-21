import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Header, ListItem } from 'react-native-elements';
import { useDynamicValue } from 'react-native-dynamic';
import i18n from 'i18n-js';
import { dynamicStyles } from './dynamicStyles';
import { getColor } from '../../config/Colors';
import { Navigation } from '../../thirdparty/react-native-navigation';
import dataStore, { KEYS, connect } from '../../data_store';
import Icon from '../../components/icon';

const themeOptions = [
  { title: 'Default', value: 'default' },
  { title: 'Beiges', value: 'beiges' },
  { title: 'Mint Green', value: 'mintGreen' },
  { title: 'Coffee', value: 'coffee' },
];

function ThemeChooseScreen(Props) {
  const styles = useDynamicValue(dynamicStyles.styles);
  const settingInfo = Props[KEYS.USER_SETTING] || {};

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
          text: i18n.t('settingLabelChooseTheme'),
          style: styles.headerTitle,
        }}
        leftComponent={goBackBtn}
      />
      <ScrollView>
        {themeOptions.map((item) => (
          <ListItem
            leftElement={(
              <ListItem.Content style={styles.listLabel}>
                <ListItem.Title style={styles.listLabelText}>{item.title}</ListItem.Title>
              </ListItem.Content>
            )}
            checkBox={{
              checked: settingInfo.colorTheme === item.value,
              onPress: () => dataStore.setUserSettings('colorTheme', item.value),
            }}
            key={item.value}
            onPress={() => dataStore.setUserSettings('colorTheme', item.value)}
            containerStyle={styles.listContainer}
          />
        ))}

      </ScrollView>
    </View>
  );
}

export default connect([KEYS.USER_SETTING])(ThemeChooseScreen);
