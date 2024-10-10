import crypto from 'crypto'

const sha256 = data => crypto
  .createHash('sha256')
  .update(data)
  .digest('hex')

export default sha256
