import { Platform, Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import i18n from 'i18n-js';
import { error as wizError } from 'wiznote-sdk-js-share';

import api from '../api';
import app from '../wrapper/app';
import { showTopBarMessage, hideTopBarMessage } from '../services/navigation';

const { WizInternalError } = wizError;

// array of Product ID/sku
const productSkus = Platform.select({
  ios: [
    'cn.wiz.note.lite.year',
  ],
  android: [
    'cn.wiz.note.lite.year',
  ],
});

function reportPurchaseError(error) {
  const title = i18n.t('titlePurchaseFailed');
  const message = i18n.t('messageFailedToPurchase', {
    message: error.message,
  });
  Alert.alert(title, message);
}

function reportPurchaseSuccess(user) {
  const title = i18n.t('titlePurchaseSuccess');
  const message = i18n.t('messagePurchaseSuccess', {
    vipDate: new Date(user.vipDate).toLocaleDateString(),
  });
  Alert.alert(title, message);
}

export async function getProducts() {
  try {
    const products = await RNIap.getProducts(productSkus);
    return products;
  } catch (err) {
    reportPurchaseError(err);
  }
  return null;
}

export async function restorePurchases() {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    if (purchases.length > 0) {
      let user;
      for (const purchase of purchases) {
        if (purchase.productId === 'cn.wiz.note.lite.year') {
          user = await verifyPurchase(purchase);
          await RNIap.finishTransaction(purchase);
        }
      }
      //
      reportPurchaseSuccess(user);
    }
  } catch (err) {
    reportPurchaseError(err);
  }
}

export async function requestPurchase(sku) {
  try {
    const ProductPurchase = await RNIap.requestPurchase(sku, false);
    console.log('after requestPurchase');
    return ProductPurchase;
  } catch (err) {
    // reportPurchaseError(err);
  }
  return null;
}

async function verifyPurchase(purchase) {
  //
  const userGuid = api.userGuid;
  const userData = api.getUserData(userGuid);
  const user = userData.user;
  //
  const server = userData.accountServer.server;
  //
  const data = {
    receipt: purchase.transactionReceipt,
    userGuid: user.userGuid,
    userId: user.userId,
    clientType: 'lite',
    apiVersion: app.getVersion(),
    transactionId: purchase.transactionId,
  };
  //
  const componentId = await showTopBarMessage({
    message: i18n.t('titlePurchasing'),
    description: i18n.t('messageVerifyingPurchase'),
    closeTimeout: 10000000,
    type: 'info',
    autoHide: false,
  });
  console.log('show top bar message');
  try {
    try {
      const request = api.core.request;
      await request.standardRequest({
        url: `${server}/as/pay2/ios`,
        data,
        method: 'POST',
      });
      //
      const userInfo = await api.refreshUserInfo(userGuid);
      return userInfo;
    } catch (err) {
      const errorMessage = i18n.t('errorVerifyPurchase', {
        message: err.message,
      });
      throw new WizInternalError(errorMessage);
    }
  } finally {
    console.log('hide top bar message');
    hideTopBarMessage(componentId);
  }
}

RNIap.purchaseUpdatedListener(async (purchase) => {
  const receipt = purchase.transactionReceipt;
  if (receipt) {
    //
    try {
      const user = await verifyPurchase(purchase);
      await RNIap.finishTransaction(purchase, true);
      reportPurchaseSuccess(user);
    } catch (err) {
      reportPurchaseError(err);
    }
  }
});

RNIap.purchaseErrorListener((error) => {
  reportPurchaseError(error);
});

// export async function requestSubscription(sku) {
//   try {
//     const ProductPurchase = await RNIap.requestSubscription(sku);
//     return ProductPurchase;
//   } catch (err) {
//     console.warn(err.code, err.message);
//   }
//   return null;
// }
