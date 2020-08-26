export default function wrap(path:string):string {
  return 'RNFetchBlob-file://' + path
}
