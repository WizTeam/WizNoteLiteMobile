import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

import { I18nManager } from 'react-native';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./en').default,
  'zh-cn': () => require('./zh-cn').default,
  'zh-tw': () => require('./zh-tw').default,
};

const languageTagMap = {
  en: 'en',
  'zh-Hans-CN': 'zh-cn',
  'zh-Hans-TW': 'zh-tw',
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export function iniI18nConfig() {
  // fallback if no available language fits
  const fallback = { languageTag: 'en', isRTL: false };

  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(
    Object.keys(languageTagMap),
  ) || fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  const language = languageTagMap[languageTag];
  i18n.translations = { [language]: translationGetters[language]() };
  i18n.locale = language;
}
