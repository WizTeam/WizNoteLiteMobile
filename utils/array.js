import findIndex from 'lodash.findindex';

export remove from 'lodash.remove';

export function upsert(arr, key, newValue) {
  const index = findIndex(arr, key);
  if (index !== -1) {
    arr.splice(index, 1, newValue);
    return arr;
  }
  arr.push(newValue);
  return arr;
}
