export default function config (options:RNFetchBlobConfig) {
  return { fetch : fetch.bind(options) }
}
