safe-access-check
=========
[![Build Status](https://travis-ci.org/amilajack/safe-access-check.svg?branch=master&maxAge=2592)](https://travis-ci.org/amilajack/safe-access-check)
[![NPM version](https://badge.fury.io/js/safe-access-check.svg?maxAge=2592)](http://badge.fury.io/js/safe-access-check)
[![Dependency Status](https://img.shields.io/david/amilajack/safe-access-check.svg?maxAge=2592)](https://david-dm.org/amilajack/safe-access-check)
[![npm](https://img.shields.io/npm/dm/safe-access-check.svg?maxAge=2592)](https://npm-stat.com/charts.html?package=safe-access-check)

**⚠️ Experimental. Intended to be used by compilers and code checkers ⚠️**

## Installation
```bash
npm install --save-dev safe-access-check
```

## Usage
```js
import { safeCoerce, safePropertyAccess } from 'safe-access-check';



// 1. Usage as an expression
// -------------------------
let some = moo + '10' // 'moo10'
some = safeCoerce('moo', '+', 10) // 'moo10'



// 2. Usage for coercion safeguard
// -------------------------------
[] + {} // "[object Object]"

safeCoerce([], '+', {})
// TypeError: 'Unexpected coercion of type "Object" and
// type "Array" using "+" operator'

NaN + undefined // NaN

safeCoerce(NaN, '+', undefined);
// TypeError: Unexpected coercion of type "NaN" and type
// "undefined" using "+" operator

safeCoerce(new String('12'), '>', 12);
// TypeError: Unexpected comparison of type "String" and type
// "number" using ">" operator


// 3. Usage for better undefined propagation errors
// ------------------------------------------------
const obj = {
  foo: {
    bar: {
      baz: false
    }
  }
}

obj.foo.bar._MOO_.baz;
// TypeError: 'Cannot read property 'baz' of undefined'

safePropertyAccess(['foo', 'bar', '_MOO_', 'baz'], obj);
// TypeError: Property "_MOO_" does not exist in "Object.foo._MOO_"



// 4. Usage as out of bounds check
// -------------------------------
const obj = {
  woo: ['']
}

obj.woo[1] // undefined

safePropertyAccess(['woo', 1], obj)
// TypeError: '"woo[1]" is out of bounds'
```
