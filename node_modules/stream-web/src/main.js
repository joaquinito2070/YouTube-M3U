import { mkdir, getPathToFile, stream, cannotBeUndefined } from './utils'
import { mapx } from 'pytils'

const _streamPromise = getPathFrom => (fileName, url) => {
  cannotBeUndefined({fileName, url})
  return stream(
    url,
    getPathFrom(fileName))
}

export const tryGetFromStreamList = async (streamList, path = './download', prefix = 'vd', format = 'mp4') => {
  const streamPromise = _streamPromise(
    getPathToFile(path, prefix, format))

  const promiseList = mapx(
    streamList,
    (url, fileName) => streamPromise(fileName, url))
  
  Promise
    .all(promiseList)
    .then(res => console.log(`End all download's`, res))
}
