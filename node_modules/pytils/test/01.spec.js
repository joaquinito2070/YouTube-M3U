const assert = require('assert')

import { type, mapx, map, copy, hasProp, length, keys, values } from '../dist/main'
import { isString, isNumber, isArray, isObject, isAOF, isUN, isNull, isUndefined, isFunction } from '../dist/main'
import { compose, composeDown, curry } from '../dist/main'
import { toArray, ifMatch, whileMatch } from '../dist/main'

let test
const o = { a:3, b:2, c:1 }
const list = {
  u:  undefined,
  n:  null,
  p:  'sdf',
  d:  1266,
  a:  [0, 1, 2],
  o:  o,
  do: {o: o, z: 123},
  f:  () => { oi = 1 }
}
list.f.a = 13

const expect = {
  u:  { type: 'undefined', copy: true,  has: { a: false, o: false }, len: -1 },
  n:  { type: 'null'     , copy: true,  has: { a: false, o: false }, len: -1 },
  p:  { type: 'string'   , copy: true,  has: { a: false, o: false }, len:  3 },
  d:  { type: 'number'   , copy: true,  has: { a: false, o: false }, len:  4 },
  a:  { type: 'array'    , copy: false, has: { a: false, o: false }, len:  3 },
  o:  { type: 'object'   , copy: false, has: { a: true,  o: false }, len:  3 },
  do: { type: 'object'   , copy: false, has: { a: false, o: true  }, len:  2 },
  f:  { type: 'function' , copy: false, has: { a: true,  o: false }, len:  1 }
}

const expect2 = {
  u:  { keys: [],                   values: [] },
  n:  { keys: [],                   values: [] },
  p:  { keys: ['0', '1', '2'],      values: ['s', 'd', 'f'] },
  d:  { keys: ['0', '1', '2', '3'], values: [1, 2, 6, 6] },
  a:  { keys: ['0', '1', '2'],      values: [0, 1, 2] },
  o:  { keys: ['a', 'b', 'c'],      values: [3, 2, 1] },
  do: { keys: ['o', 'z'],           values: [ { a: 3, b: 2, c: 1 }, 123 ] },
  f:  { keys: ['a'],                values: [ 13 ] }
}

const expect3 = [
  { isUndefined, t: 'undefined' },
  { isNull,      t: 'null'      },
  { isString,    t: 'string'    },
  { isNumber,    t: 'number'    },
  { isArray,     t: 'array'     },
  { isObject,    t: 'object'    },
  { isFunction,  t: 'function'  },
  { isAOF,       t: ['array', 'object', 'function'] },
  { isUN,        t: ['undefined', 'null'] }
]

const rollTest = (fx, test, param, comp) => (val, key) => {
  const x = fx(val, param)
  const res = comp
    ? comp(val, x)
    : x
  const exp = param
    ? expect[key][test][param]
    : expect[key][test]
  it(key, () => assert.equal(res, exp))
}

describe('type', () => {
  mapx(list, rollTest(type, 'type'))
})

describe('keys', () => {
  mapx(list,
    (val, key) => {
      const res = keys(val)
      const exp = expect2[key]['keys']
      it(key, () => assert.deepEqual(res, exp))
  })
})

describe('values', () => {
  mapx(list,
    (val, key) => {
      const res = values(val)
      const exp = expect2[key]['values']
      it(key, () => assert.deepEqual(res, exp))
  })
})

mapx(expect3, item => {
  const fName = keys(item)[0]
  const [ fun, test ] = values(item)
  describe(fName, () => {
    mapx(list,
      (val, key) => {
        const res = fun(val)
        const _type = expect[key]['type']
        const exp = type(test) === 'array' ? test.indexOf(_type) >= 0: _type === test
        it(key, () => assert.equal(res, exp))
    })
  })
})

describe('copy', () => {
  mapx(list, rollTest(copy, 'copy', false, (a,b)=>a===b))
})

describe('hasProp a', function() {
  mapx(list, rollTest(hasProp, 'has', 'a'))
})

describe('hasProp o', function() {
  mapx(list, rollTest(hasProp, 'has', 'o'))
})

describe('length', function() {
  mapx(list, rollTest(length, 'len'))
})

describe('compose', function() {
  const res = compose(
    x => x *3,
    x => x +50
  )(123)
  it('normal', () => assert.equal(res, 519))

  const res2 = composeDown(
    x => x *3,
    x => x +50
  )(123)
  it('inverse', () => assert.equal(res2, 419))
})

describe('curry', function() {
  const list = [1, 2, 3]
  const fun = (v, k) => v +v +k
  const _map = curry(func => list => mapx(list, func))

  const exp = map(fun)(list)
  const res = _map(fun)(list)

  it('test', () => assert.deepEqual(res, exp))
})

describe('regex', function() {
  const rx = /(a)(\d)(c)/gim
  const data = 'xxxa1cxxxa2cxxx'
  const data2 = 'xxxa3cxxxa4cxxx'
  const fX = x => ({r: x})
  const _if = ifMatch(rx, fX)
  const _while = whileMatch(rx, fX)

  it('toArray', () => assert.deepEqual(
    toArray(rx.exec(data)),
    [ 'a', '1', 'c' ] ))

  it('if data 1', () => assert.deepEqual(
    _if(data),
    {r: [ 'a', '1', 'c' ]} ))
  
  it('if data 1 again', () => assert.deepEqual(
    _if(data),
    {r: [ 'a', '1', 'c' ]} ))

  it('if data 2', () => assert.deepEqual(
    _if(data2),
    {r: [ 'a', '3', 'c' ]} ))
  
  it('while data 1', () => assert.deepEqual(
    _while(data),
    [ { r: [ 'a', '1', 'c' ] }, { r: [ 'a', '2', 'c' ] } ] ))
  
  it('while data 2', () => assert.deepEqual(
    _while(data2),
    [ { r: [ 'a', '3', 'c' ] }, { r: [ 'a', '4', 'c' ] } ] ))

  it('while data 1 again', () => assert.deepEqual(
    _while(data),
    [ { r: [ 'a', '1', 'c' ] }, { r: [ 'a', '2', 'c' ] } ] ))
})
