import { UIManager, LayoutAnimation } from 'react-native';

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function enableNextAnimation(finishCallback) {
  LayoutAnimation.configureNext({
    duration: 250,
    update: {
      type: LayoutAnimation.Types.easeIn,
      springDamping: 0.7,
    },
    create: {
      type: LayoutAnimation.Types.easeIn,
      property: LayoutAnimation.Properties.scaleY,
      springDamping: 0.7,
    },
  }, () => {
    if (finishCallback) {
      finishCallback();
    }
  });
}
