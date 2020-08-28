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
        // From react-native-iap@4.1.0 you can simplify above `method`.
        // Try to wrap the statement with `try` and `catch` to also grab the `error` message.
        // If consumable (can be purchased again)
        await RNIap.finishTransaction(purchase, true);
        // If not consumable
        await RNIap.finishTransaction(purchase, false);
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
