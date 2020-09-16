import React, { useEffect, useRef } from 'react';
import * as RNIap from 'react-native-iap';

const IapListener: () => React$Node = () => {
  const purchaseUpdateSubscription = useRef(null);
  const purchaseErrorSubscription = useRef(null);

  useEffect(() => {
    purchaseUpdateSubscription.current = RNIap.purchaseUpdatedListener(async (purchase) => {
      console.log('purchaseUpdatedListener', purchase);
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        // 消耗品（可再次购买）
        await RNIap.finishTransaction(purchase, true);
        // 非消耗品
        // await RNIap.finishTransaction(purchase, false);
      }
    });

    purchaseErrorSubscription.current = RNIap.purchaseErrorListener((error) => {
      console.warn('purchaseErrorListener', error);
    });

    return () => {
      purchaseUpdateSubscription.current.remove();
      purchaseUpdateSubscription.current = null;
      purchaseErrorSubscription.current.remove();
      purchaseErrorSubscription.current = null;
    };
  }, []);

  return (<></>);
};

export default IapListener;
