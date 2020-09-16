import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import i18n from 'i18n-js';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { Navigation } from '../thirdparty/react-native-navigation';

import api from '../api';

import ThemedStatusBar from '../components/ThemedStatusBar';
import IapListener from '../components/IapListener';
import { getDynamicColor } from '../config/Colors';
import { getProducts, requestPurchase, restorePurchases } from '../utils/iap';
import UploadCloudIcon from '../components/svg/UploadCloudIcon';
import CrownIcon from '../components/svg/CrownIcon';

const UpgradeToVipScreen: () => React$Node = (props) => {
  //
  const styles = useDynamicValue(dynamicStyles);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  //
  const { user } = api;
  //
  async function handlePurchase() {
    setLoading(true);
    try {
      const result = await requestPurchase('cn.wiz.note.lite.year');
      console.log('handlePurchase result', result);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  function handleRestorePurchases() {
    restorePurchases();
  }

  function handleCloseUpgrade() {
    Navigation.dismissModal(props.componentId);
  }

  useEffect(() => {
    async function handleGetProducts() {
      const res = await getProducts();
      if (res) {
        setAvailable(true);
      }
    }

    if (!available) {
      handleGetProducts();
    }
  });

  let buttonText = '';
  //
  if (user && (user.vip || user.vipDate)) {
    buttonText = i18n.t('buttonRenewVIPWithPrice');
  } else {
    buttonText = i18n.t('buttonUpgradeVIPWithPrice');
  }

  let userVipMessage = '';
  if (user) {
    if (user.vip) {
      const date = new Date(user.vipDate).toLocaleDateString();
      userVipMessage = i18n.t('messageVipServiceDate', { date });
    } else if (user.vipDate) {
      const date = new Date(user.vipDate).toLocaleDateString();
      userVipMessage = i18n.t('messageVipServiceEndedDate', { date });
    }
  }

  return (
    <>
      <ThemedStatusBar />
      <IapListener />
      <SafeAreaView>
        <View
          style={styles.scrollView}
        >
          <View style={styles.closeBox}>
            <TouchableOpacity style={styles.closeTouchable} onPress={handleCloseUpgrade}>
              <Icon name="close" color={styles.serverDropdownIcon.color} size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.banner}>
            <Text style={[styles.bannerText, styles.upgradeToVip]}>{i18n.t('labelUpgradeToVip')}</Text>
            <Text style={[styles.bannerText, styles.upgradeToVipWhy]}>
              {i18n.t('labelUpgradeToVipWhy')}
            </Text>
            <Text style={[styles.bannerText, styles.upgradeToVipWhy, { marginBottom: 32 }]}>
              {userVipMessage}
            </Text>
          </View>
          <View style={styles.content}>
            <UploadCloudIcon style={styles.uploadCloudIcon} fill={styles.contentText.color} />
            <Text style={[styles.contentText]}>{i18n.t('labelUpgradeVipMessage1')}</Text>
            <Text style={[styles.contentText]}>{i18n.t('labelUpgradeVipMessage2')}</Text>
            <Button
              onPress={handlePurchase}
              containerStyle={styles.upgradeContainerStyle}
              buttonStyle={styles.upgradeButton}
              titleStyle={styles.upgradeTitle}
              icon={<CrownIcon fill={styles.upgradeTitle.color} />}
              title={buttonText}
              loading={loading}
              disabled={!available}
            />
            <Button
              onPress={handleRestorePurchases}
              type="clear"
              titleStyle={{ fontSize: 14 }}
              title={i18n.t('buttonRestorePurchases')}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

UpgradeToVipScreen.options = {
  topBar: {
    visible: false,
  },
};

const dynamicStyles = new DynamicStyleSheet({
  scrollView: {
    minHeight: '100%',
    backgroundColor: getDynamicColor('upgradeBackgroundColor'),
  },
  closeTouchable: {
    padding: 8,
    marginRight: 8,
  },
  serverDropdownIcon: {
    color: getDynamicColor('loginBoxText'),
  },
  closeBox: {
    display: 'flex',
    flexDirection: 'row-reverse',
    backgroundColor: getDynamicColor('upgradeBannerBackgroundColor'),
  },
  banner: {
    backgroundColor: getDynamicColor('upgradeBannerBackgroundColor'),
  },
  bannerText: {
    textAlign: 'center',
  },
  upgradeToVip: {
    fontSize: 16,
    color: getDynamicColor('upgradeText'),
    fontWeight: '600',
    marginTop: 35,
    marginBottom: 16,
  },
  upgradeToVipWhy: {
    fontSize: 12,
    color: getDynamicColor('upgradeText2'),
    marginBottom: 8,
  },
  contentText: {
    color: getDynamicColor('upgradeText'),
    marginBottom: 8,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  uploadCloudIcon: {
    marginTop: 25,
    marginBottom: 25,
  },
  upgradeButton: {
    backgroundColor: getDynamicColor('upgradeButtonBackground'),
    borderRadius: 0,
  },
  upgradeContainerStyle: {
    borderRadius: 0,
    marginTop: 72,
    marginBottom: 16,
    minWidth: 200,
  },
  upgradeTitle: {
    fontSize: 14,
    color: getDynamicColor('upgradeButtonColor'),
  },
});

export default UpgradeToVipScreen;
