import moment from 'moment';


export function formatDateString(date) {
  const aYearAgo = moment(new Date()).add(-1, 'y');
  const dateText = moment(date).isBefore(aYearAgo)
    ? moment(date).calendar()
    : moment(date).fromNow();
  return dateText;
}
