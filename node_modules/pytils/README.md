# pytils: functions utils like python
many functions that use to simplify my javascript and that the syntax is inspired by python and ramda

## I will help if you have any difficulty =)
Contact me by [github:heyderpd](https://github.com/heyderpd). I'll be glad to help you.

## Thanks for [npm~lucasmreis](https://www.npmjs.com/~lucasmreis)
```javascript
npm install --save pytils
```

## Example:
```terminal
const p = require('pytils')

p.compose = function ( _arrayOfFunctions ) // return function waiting for input
p.curry   = function ( _function ) // return function waiting for input
p.path [curry] = function ( _arrPathOfProps, _object ) // return prop of _object in path or undefined
p.reduce = ( _object , fx ) // do each of any type, pass to function var's (key, value) to return a value

p.copy    = ( _object ) // copy any types
p.length  = ( _object ) // get length of any type, return -1 if can't
p.keys    = ( _object ) // get keys of any type, return [] if can't
p.values  = ( _object ) // get values of any type, return [] if can't
p.hasProp = ( _object , prop ) // of any type, return true or false

p.type     = function ( _object ) // return type of var in a string
p.isType   = function ( _object , _type_need) // return true or false
p.isString = function ( _object ) // return true or false
p.isNumber = function ( _object ) // return true or false
p.isArray  = function ( _object ) // return true or false
p.isObject = function ( _object ) // return true or false
p.isFunction = function ( _object ) // return true or false
p.isAOF  = function ( _object ) // return true or false if is isArray OR isObject OR isFunction
p.isNull = function ( _object ) // return true or false
p.isUndefined = function ( _object ) // return true or false

p.toObject = ( _array ) // convert array to object, return object have values of array in keys of object
p.arrayDiff = ( _array base , _array compare ) // compare two array and return the diff values of base
p.invertObj = ( _object ) // convert object keys in value and value in keys
p.uniq = ( _array ) // get unique values of array, work with simple var's
p.eq1True   = ( _array ) // if is a array of one value of true, return true
p.uniqWith  = ( _comparator, _array ) // foreach array and return unique itens with comparator
p.uniqObject  = ( _objectA, _objectB ) // compare all prop of two object and return if is equal
p.ojbFromVals = ( _array ) // create object from array values
p.ifThrow = ( bool, string ) // trow text erro if bool is true

var _function = function( key, value ) { console.log('item: ', keys, ' = ', value) }
p.map [curry] = ( _function , _object ) // do each of any type, pass to function var's (key, value)
p.mapx = ( _object , _function ) // do each of any type, pass to function var's (key, value)

var _dictionary = { toA, 'fromB', toC: 'fromD' }
p.translate [curry] = ( _dictionary, _array ) // translate object using dictionary of props
```
