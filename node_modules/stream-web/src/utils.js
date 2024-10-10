import { mkdir as _mkdir, stat, createWriteStream } from 'fs'
import request from 'request'
import { mapx } from 'pytils'

export const cannotBeUndefined = essentials => {
  mapx(essentials,
    (key, value) => {
      if (!value) {
        throw `${key} cannot be undefined`
      }
    })
}

const fileMode = parseInt('0777', 8)

export const mkdir = path => stat(
  path,
  (err, stats) => {
    if (err) {
      _mkdir(
        path,
        fileMode,
        err => {
          if (err) {
            throw `mkdir: ${err}`
          }
        })
    }
  })

export const getPathToFile = (path, prefix, format) => name => `${path}/${prefix}-${name}.${format}`

const downloadProgress = (file, value) => console.log(`Download Progress ${(value /1024 /1024).toFixed(2)} MB in ${file}`)

function ACC(file, show){
  this.show = show
  this.acc = 0
  this.roll = value => (
    this.acc += value,
    this.show(file, this.acc))
}

export const stream = (url, pathAndFile) => new Promise(
  (resolve, reject) => {
    try {
      const { roll } = new ACC(pathAndFile, downloadProgress)
      const reqStream = request(url)
      const fileStream = createWriteStream(pathAndFile)
      reqStream.pipe(fileStream)
      reqStream.on('data', data => roll(data.length))
      reqStream.on('finish', () => resolve(fileName))
    } catch (err) {
      reject(err)
    }
  })
