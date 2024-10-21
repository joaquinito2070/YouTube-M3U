import { hasProp, isString, ifThrow } from 'pytils'
import { stringify, _memorize, isEssential, _ifT } from './utils'
import sha256 from './sha256'

const limit = 20
const inMind = {}
const memorize = _memorize(inMind, limit)

const _remember = (contextId, context, contextString, Throw) => noMemo => {
  contextString = contextString ? contextString : stringify(context)
  if (hasProp(inMind, contextId)) {
    const keeper = inMind[contextId]
    if (hasProp(keeper.memo, contextString)) {
      return keeper.memo[contextString]
    }
    ifThrow(Throw, 'dejavu-call: no memory found')
  }
  ifThrow(Throw, 'dejavu-call: no keeper found')
  return noMemo(contextString)
}

export const getHash = data => {
  ifThrow(
    !isString(data),
    'dejavu-call(getHash): data is a essential! and need to be a string')

  return sha256(data)
}

export const remember = (contextId, context, contextString = false, Throw = true) => {
  isEssential(()=>null, contextId, context)
  return _remember(
    contextId,
    context,
    contextString,
    Throw
  )(() => null)
}

export const recall = (contextId, Service, context, contextString = false, Throw = false) => {
  isEssential(Service, contextId, context)
  return _remember(
    contextId,
    context,
    contextString,
    Throw
  )(contextString => {
    const result = Service(...context)
    memorize(contextId, contextString, result)
    return result
  })
}
