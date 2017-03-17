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
// Throws TypeError: 'Unexpected coercion of type "object" and
// type "array" using "+" operator'

NaN + undefined // NaN

safeCoerce(NaN, '+', undefined);
// Throws TypeError: Unexpected coercion of type "NaN" and type
// "undefined" using "+" operator

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
// Throws TypeError: 'Cannot read property 'baz' of undefined'

safePropertyAccess(['foo', 'bar', '_MOO_', 'baz'], obj);
// Throws TypeError: '"foo.bar._MOO_" is not defined'

// 4. Usage as out of bounds check
// -------------------------------
const obj = {
  woo: ['']
}

obj.woo[1] // undefined

safePropertyAccess(['woo', 1], obj)
// Throws TypeError: '"woo.1" is out of bounds'
```
