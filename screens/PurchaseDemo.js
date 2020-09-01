import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
} from 'react-native';

import i18n from 'i18n-js';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { Button } from 'react-native-elements';

import ThemedStatusBar from '../components/ThemedStatusBar';
import IapListener from '../components/IapListener';
import { getDeviceDynamicColor } from '../config/Colors';
import { getProducts, requestPurchase } from '../utils/iap';

const PurchaseDemo: () => React$Node = (props) => {
  //
  const styles = useDynamicValue(dynamicStyles);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  //
  async function handleGetProducts() {
    setLoading(true);
    const res = await getProducts();
    setLoading(false);
    setProducts(JSON.stringify(res));
  }
  //
  async function handlePurchase() {
    setLoading(true);
    const result = await requestPurchase('cn.wiz.note.lite.year');
    console.log('handlePurchase result', result);
    setLoading(false);
  }

  return (
    <>
      <ThemedStatusBar />
      <IapListener />
      <SafeAreaView style={styles.content}>
        <Button loading={loading} onPress={handleGetProducts} title="get products" />
        <Text>{products}</Text>
        <Button disabled={products === null} loading={loading} onPress={handlePurchase} title="purchase" />
      </SafeAreaView>
    </>
  );
};

PurchaseDemo.options = {
  topBar: {
    title: {
      text: 'Purchase',
    },
    largeTitle: {
      visible: true,
    },
  },
};

const dynamicStyles = new DynamicStyleSheet({
  content: {
    display: 'flex',
    flex: 1,
  },
  body: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
    minHeight: '100%',
    flexGrow: 1,
  },
});

export default PurchaseDemo;
