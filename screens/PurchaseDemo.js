import React, { useState, useEffect } from 'react';
import {
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import i18n from 'i18n-js';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

import ThemedStatusBar from '../components/ThemedStatusBar';
import IapListener from '../components/IapListener';
import { getDynamicColor } from '../config/Colors';
import { getProducts, requestPurchase } from '../utils/iap';
import UploadCloudIcon from '../components/svg/UploadCloudIcon';
import CrownIcon from '../components/svg/CrownIcon';

const PurchaseDemo: () => React$Node = () => {
  //
  const styles = useDynamicValue(dynamicStyles);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  //
  async function handlePurchase() {
    setLoading(true);
    const result = await requestPurchase('cn.wiz.note.lite.year');
    console.log('handlePurchase result', result);
    setLoading(false);
  }

  useEffect(() => {
    async function handleGetProducts() {
      const res = await getProducts();
      if (res) {
        setAvailable(true);
      } else {
        setAvailable(false);
      }
    }

    handleGetProducts();
  });

  return (
    <>
      <ThemedStatusBar />
      <IapListener />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.closeBox}>
            <TouchableHighlight style={styles.closeTouchable}>
              <Icon name="close" color={styles.serverDropdownIcon.color} size={24} />
            </TouchableHighlight>
          </View>
          <View style={styles.banner}>
            <Text style={[styles.bannerText, styles.upgradeToVip]}>{i18n.t('labelUpgradeToVip')}</Text>
            <Text style={[styles.bannerText, styles.upgradeToVipWhy]}>
              {i18n.t('labelUpgradeToVipWhy')}
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
              title={i18n.t('buttonUpgradeVIPWithPrice')}
              loading={loading}
              disabled={!available}
            />
            <Button
              type="clear"
              titleStyle={{ fontSize: 14 }}
              title={i18n.t('buttonRestorePurchases')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

PurchaseDemo.options = {
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
    marginBottom: 34,
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

export default PurchaseDemo;
