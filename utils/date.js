import moment from 'moment';

console.log(moment(new Date(2010, 1, 1)).calendar());

export function formatDateString(date) {
  const aYearAgo = moment(new Date()).add(-1, 'y');
  const dateText = moment(date).isBefore(aYearAgo)
    ? moment(date).calendar()
    : moment(date).fromNow();
  return dateText;
}
