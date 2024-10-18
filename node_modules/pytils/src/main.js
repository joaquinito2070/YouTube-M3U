
/*!
 * pytils
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * ISC Licensed
*/

/* TYPE */

export const type = obj => {
  if (obj === null) {
    return 'null'
  }
  if (obj === undefined) {
    return 'undefined'
  }
  const _typeOf = typeof(obj)
  switch (_typeOf) {
    case 'function':
      return 'function'

    case 'number':
      return isNaN(obj)
        ? 'NaN'
        : 'number'

    case 'object':
      const _type = obj.constructor
      if (_type === Object) {
        return 'object'
      }
      if (_type === Array) {
        return 'array'
      }

    default:
      return _typeOf
  }
}

export const isType = (obj, _type) => type(obj) === _type

export const isString = obj => isType(obj, 'string')

export const isNumber = obj => isType(obj, 'number')

export const isArray = obj => isType(obj, 'array')

export const isObject = obj => isType(obj, 'object')

export const isFunction = obj => isType(obj, 'function')

export const isAOF = obj => obj !== null && ['object', 'function'].indexOf(typeof(obj)) >= 0

export const isUN = obj => obj === undefined || obj === null

export const isNull = obj => obj === null

export const isUndefined = obj => obj === undefined

/* TYPE */
/* RAMDA LIKE */

const getArgs = fx => function() {
  const args = []
  for (let key in arguments) {
    args.push(arguments[key])
  }
  return fx(args)
}

export const composeDown = getArgs(funcs => input =>
  funcs.reduce(
      (obj, fx) => fx(obj), input))

export const compose = getArgs(funcs => input =>
  funcs.reduceRight(
      (obj, fx) => fx(obj), input))

export const curry = func => getArgs(args =>
  args.reduce(
    (fx, arg) => fx(arg),
    func))

export const path = curry(
  path => obj =>
    path.reduce(
      (acc, item) => {
        return !isUN(acc)
          ? acc[item]
          : undefined
      }, obj))

export const mapx = (list, func) => {
  switch (type(list)) {
    case 'array':
      return list.map(func)

    case 'object':
    case 'function':
      return keys(list)
        .map(key => func(list[key], key))

    default:
      return undefined
  }
}

export const map = curry(func => list => mapx(list, func))

export const reduce = (func, obj) => list => {
    return isArray(list)
      ? list.reduce(func, obj)
      : (isObject(list)
        ? keys(list)
          .reduce(
            (obj, key) => func(obj, list[key], key),
            obj)
        : undefined
      )
  }

export const uniqWith = (comparator, list) => {
  const outputList = []
  map(
    itemA => {
      const equals = map(
          itemB => comparator(itemA, itemB)
        )(outputList)
        .filter(item => item)

      equals && equals.length === 0 && outputList.push(itemA)
    })(list)
  return outputList
}

export const uniq = list => {
  const New = []
  list.map(
    item => New.indexOf(item) < 0
      ? New.push(item)
      : null)
  return New
}

/* RAMDA LIKE */
/* REGEX */

export const toArray = match => match.slice(1, match.length)

export const unmountRegEx = RegEX => {
  RegEX = RegEX.toString()
  const getFlags = /\/(\w*)$/m
  const [ flags ] = toArray(getFlags.exec(RegEX))
  RegEX = RegEX
    .substr(1, RegEX.length)
    .replace(getFlags, '')
  return [ RegEX, flags ]
}

export const reCompile = RX => {
  const [ RegEX, flags ] = unmountRegEx(RX)
  return new RegExp(RegEX, flags)
}

export const ifMatch = (RX, fx) => {
  const regX = reCompile(RX)
  return word => {
    regX.lastIndex = 0
    let match
    if (match = regX.exec(word)) {
      return fx(toArray(match))
    }
  }
}

export const whileMatch = (RX, fx) => {
  const regX = reCompile(RX)
  return word => {
    regX.lastIndex = 0
    const result = []
    let match
    while (match = regX.exec(word)) {
      result.push(
        fx(toArray(match)))
    }
    return result
  }
}

/* REGEX */
/* PYTILS */

export const arrayDiff = (list, compare) => {
  if (length(compare) <= 0) {
    return copy(list)
  }
  if (length(list) <= 0) {
    return copy(compare)
  }
  const obj = toObject(list)
  compare
    .map(k => delete obj[k])
  return keys(obj)
}

export const toObject = input => {
  if (isArray(input) && length(v) <= 0) {
    return {}
  }
  return input
    .reduce((obj, v, k) => {
      obj[v] = copy(k)
      return obj
    }, {})
}

export const invertObj = input => {
  return reduce(
    (obj, val, key) => {
      obj[val] = key
      return obj
    }, {})(input)
}

export const ojbFromVals = arrKeys => arrKeys
  .reduce(
    (obj, val) => {
      obj[val] = val
      return obj
    }, {})

export const translate = curry(
  dictionary => original => {
    return reduce(
      (obj, ori, des) => {
        obj[des] = path([ori], original)
        return obj
      }, {})(dictionary)
  })

export const uniqObject = (A, B) => compose(
    arr => arr && arr.length === 1 && arr[0] === true,
    uniq,
    map(key => path([key], A) === path([key], B)),
    keys
  )(A)

export const ifThrow = (Throw, text) => {
  if (Throw) {
    throw text
  }
}

const essentialDict = {
  'UN':  isUN,
  'AOF': isAOF,
  'string': isString,
  'number': isNumber,
  'array':  isArray,
  'object': isObject,
  'null':   isNull,
  'undefined': isUndefined,
  'function':  isFunction
}

const essentialErro = (name, type) => `pytils: Params[x].${name} is a essential! and need to be a valid '${type}'.`

export const isEssential = moduleName => Params => {
  const getErro = (name, type) => `${moduleName}: ${name} is a essential! and need to be a valid '${type}'.`
  mapx(Params,
    data => {
      const name  = path([0], keys(data))
      const param = path([name], data)
      const _type  = path(['t'], data) || path(['type'], data)
      const _func = essentialDict[_type]
      const func  = _func ? _func : path(['f'], data) || path(['func'], data)

      ifThrow(
        !isString(_type),
        essentialErro('type', 'string'))
      ifThrow(
        !isFunction(func),
        essentialErro('func', 'type function'))
      ifThrow(
        !func(param),
        getErro(name, _type))
    })
}

/* PYTILS */
/* OBJECT */

const _keys = (() => {
  const ObjectHas = path(['prototype', 'hasOwnProperty'], Object)

  return obj => {
    if (isAOF(obj)) {
      const props = []
      for (let p in obj) {
        props.push(p)
      }
      const has = ObjectHas ? ObjectHas : path(['hasOwnProperty'], obj)
      return isFunction(has)
        ? props
          .filter(
            p => has.call(obj, p))
        : props
    }
    return []
  }
})()

export const scopedObject = (obj = {}, fxs) => _keys(fxs)
  .reduce(
    (acc, key) => {
      const value = fxs[key]
      acc[key] = value(obj)
      return acc
    },
    obj)

export const keys = obj => {
  switch(type(obj)) {
    case 'number':
      obj = String(obj)

    case 'string':
      obj = obj.split('')

    case 'array':
    case 'object':
    case 'function':
      return _keys(obj)

    case 'null':
    case 'undefined':
    default:
      return []
  }
}

export const values = obj => {
  switch(type(obj)) {
    case 'number':
      return String(obj)
        .split('')
        .map(n => parseInt(n))

    case 'string':
      return obj.split('')

    case 'object':
    case 'function':
      return map(
        val => val,
        obj)

    case 'array':
      return obj

    case 'null':
    case 'undefined':
    default:
      return []
  }
}

export const _copy = (obj, R = 0) => {
  ifThrow(
    R++ > 42,
    'Limit recursive exceeded in pytils.copyObject')

  if (isAOF(obj)) {
    const nObj = new obj.constructor()
    map(
      (v, k) => nObj[k] = _copy(v, R),
      obj)
    return nObj
  }

  return obj
}

export const copy = obj => _copy(obj)

export const hasProp = (obj, item) => isAOF(obj)
  ? keys(obj).indexOf(item) >= 0
  : false

export const length = obj => {
  switch(type(obj)) {
    case 'function':
      if (hasProp(obj, 'length')) {
        return obj.length
      }

    case 'number':
    case 'object':
      return keys(obj).length

    case 'string':
    case 'array':
      return obj.length

    case 'null':
    case 'undefined':
    default:
      return -1
  }
}

/* OBJECT */
