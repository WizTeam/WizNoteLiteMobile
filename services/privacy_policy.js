import React from 'react';
import SyncStorage from 'sync-storage';
import Hyperlink from 'react-native-hyperlink';
import i18n from 'i18n-js';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import RNExitApp from 'react-native-exit-app';
import { Navigation } from '../thirdparty/react-native-navigation';
import { getDynamicColor } from '../config/Colors';
import { isIos } from '../utils/device';

function PrivacyPolicyAlert({ componentId }) {
  const accept = () => {
    SyncStorage.set('has_show_privacy_policy', true);
    Navigation.dismissOverlay(componentId);
  };
  const refuse = () => {
    RNExitApp.exitApp();
  };
  function handleParseLinkText(url) {
    if (url.indexOf('share-termsofuse') !== -1) {
      return i18n.t('textTermsOfUse');
    } else if (url.indexOf('wiz-privacy') !== -1) {
      return i18n.t('textPrivacy');
    }
    return '';
  }

  function handlePressLink(url) {
    Linking.openURL(url);
  }

  return (
    <View style={styles.root}>
      <View style={styles.alert}>
        <Text style={styles.title}>{i18n.t('textPrivacy')}</Text>
        <Hyperlink
          linkStyle={styles.link}
          linkText={handleParseLinkText}
          onPress={handlePressLink}
        >
          <Text style={styles.declare}>{i18n.t('alertPrivacy')}</Text>
        </Hyperlink>
        <View style={styles.buttonGroup}>
          <Button type="clear" title={i18n.t('privacyDecline')} onPress={refuse} />
          <Button type="clear" title={i18n.t('privacyAccept')} onPress={accept} />
        </View>
      </View>
    </View>
  );
}

const styles = {
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050',
  },
  alert: {
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
    width: 264,
    elevation: 4,
    padding: 16,
  },
  title: {
    fontSize: 18,
  },
  message: {
    marginVertical: 8,
  },
  declare: {
    fontSize: 12,
    lineHeight: 22,
    color: getDynamicColor('loginBoxText2'),
    textAlign: 'center',
    paddingVertical: 16,
  },
  link: {
    color: '#2980b9',
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
};

Navigation.registerComponent('PrivacyPolicy', () => PrivacyPolicyAlert);

export function showPrivacyPolicy() {
  if (isIos) return;
  const hasShowPrivacyPolicy = SyncStorage.get('has_show_privacy_policy');
  if (hasShowPrivacyPolicy) return;
  Navigation.showOverlay({
    component: {
      name: 'PrivacyPolicy',
      options: {
        overlay: {
          interceptTouchOutside: true,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
      },
    },
  });
}
