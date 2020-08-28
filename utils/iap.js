import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

// array of Product ID/sku
export const ProductSkus = Platform.select({
  ios: [
    'com.example.coins100',
  ],
  android: [
    'com.example.coins100',
  ],
});

export async function requestPurchase(sku) {
  try {
    const ProductPurchase = await RNIap.requestPurchase(sku, false);
    return ProductPurchase;
  } catch (err) {
    console.warn(err.code, err.message);
  }
  return null;
}

export async function requestSubscription(sku) {
  try {
    const ProductPurchase = await RNIap.requestSubscription(sku);
    return ProductPurchase;
  } catch (err) {
    console.warn(err.code, err.message);
  }
  return null;
}
