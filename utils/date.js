import moment from 'moment';
import i18n from 'i18n-js';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';
import 'moment/locale/zh-hk';
import 'moment/locale/zh-mo';

moment.locale(i18n.currentLocale());

export function formatDateString(date) {
  const aYearAgo = moment(new Date()).add(-1, 'y');
  const dateText = moment(date).isBefore(aYearAgo)
    ? moment(date).calendar()
    : moment(date).fromNow();
  return dateText;
}
