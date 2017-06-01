import { expect as chaiExpect } from 'chai';
import { safeCoerce, safeMethodCall } from '../src/index';


/* eslint no-new-wrappers: 0 */

describe.skip('Safe Method Call', () => {
  chaiExpect(() => {
    const obj = {
      some() {}
    };
    safeMethodCall(obj, 'foo');
  })
  .to.throw(TypeError, 'Method "foo" does not exist in given object');
});

describe('Safe Coerce', () => {
  describe('Binary Operators', () => {
    it('should work with multiplication operator', () => {
      chaiExpect(() => {
        safeCoerce('some', '*', 10);
      })
      .to.throw(TypeError, 'Unexpected coercion of type "string" and type "number" using "*" operator');
      chaiExpect(() => {
        safeCoerce({}, '*', 10);
      })
      .to.throw(TypeError, 'Unexpected coercion of type "Object" and type "number" using "*" operator');
    });

    it('should work with division operator', () => {
      chaiExpect(() => {
        safeCoerce('some', '/', 10);
      })
      .to.throw(TypeError, 'Unexpected coercion of type "string" and type "number" using "/" operator');
      chaiExpect(() => {
        safeCoerce({}, '/', 10);
      })
      .to.throw(TypeError, 'Unexpected coercion of type "Object" and type "number" using "/" operator');
    });

    it('should work with exponent operator', () => {
      chaiExpect(() => {
        safeCoerce('some', '**', 10);
        safeCoerce({}, '**', 10);
      })
      .to.throw(TypeError, 'Unexpected coercion of type "string" and type "number" using "**" operator');
      chaiExpect(() => {
        safeCoerce({}, '**', 10);
      })
      .to.throw(TypeError, 'Unexpected coercion of type "Object" and type "number" using "**" operator');
    });

    it('should work with subtraction operator', () => {
      chaiExpect(() => {
        safeCoerce('some', '-', 10);
      })
      .to.throw(TypeError, 'Unexpected coercion of type "string" and type "number" using "-" operator');
      chaiExpect(() => {
        safeCoerce({}, '-', 10);
      })
      .to.throw(TypeError, 'Unexpected coercion of type "Object" and type "number" using "-" operator');
    });
  });

  describe('Comparison', () => {
    it('should compare values with ">" operator', () => {
      chaiExpect(safeCoerce('b', '>', 'aaa')).to.equal(true);
    });

    it('should compare numbers', () => {
      const num1 = 1;
      const num2 = new Number(1);
      chaiExpect(safeCoerce(num1, '>', num2)).to.equal(false);
      chaiExpect(safeCoerce(100, '>', 10)).to.equal(true);
    });

    it('should compare new String() values with ">" operator', () => {
      const str1 = new String('b');
      const str2 = new String('aaa');
      chaiExpect(safeCoerce(str1, '>', str2)).to.equal(true);
      chaiExpect(safeCoerce(new String('a'), '<', 'bbb')).to.equal(true);
    });

    it('should fail on comparison of numbers and strings', () => {
      chaiExpect(() => {
        safeCoerce(new String('12'), '<', 12);
      })
      .to.throw(TypeError, 'Unexpected comparison of type "String" and type "number" using "<" operator');
    });

    it('should fail on comparison of unexpected types', () => {
      chaiExpect(() => {
        safeCoerce([], '>', {});
      })
      .to.throw(TypeError, 'Unexpected comparison of type "Array" and type "Object" using ">" operator');
      chaiExpect(() => {
        safeCoerce({}, '>', []);
      })
      .to.throw(TypeError, 'Unexpected comparison of type "Object" and type "Array" using ">" operator');
    });

    it('should not compare special objects', () => {
      chaiExpect(() => {
        safeCoerce({ some: 'foo' }, '>', { bar: 'baz' });
      })
      .to.throw(TypeError, 'Unexpected comparison of type "Object" and type "Object" using ">" operator');
      chaiExpect(() => {
        safeCoerce({ some: 'foo' }, '>', ['some']);
      })
      .to.throw(TypeError, 'Unexpected comparison of type "Object" and type "Array" using ">" operator');
      chaiExpect(() => {
        safeCoerce(NaN, '>', ['some']);
      })
      .to.throw(TypeError, 'Unexpected comparison of type "NaN" and type "Array" using ">" operator');
    });
  });

  it('should return values that pass', () => {
    chaiExpect(safeCoerce(1, '+', 1)).to.equal(2);
    chaiExpect(safeCoerce(10, '-', 10)).to.equal(0);
  });

  it('should allow string concat', () => {
    chaiExpect(safeCoerce('moo', '+', 10)).to.equal('moo10');
  });

  it('should allow string concat reassignment', () => {
    const some = 'moo';
    chaiExpect(safeCoerce(some, '+=', 10)).to.equal('moo10');
    chaiExpect(safeCoerce(10, '+', some)).to.equal('10moo');
  });

  it('should allow new String() concat', () => {
    chaiExpect(safeCoerce(new String('moo'), '+=', 10)).to.equal('moo10');
    chaiExpect(safeCoerce(new String('moo'), '+', new String('moo'))).to.equal('moomoo');
  });

  it('should allow reassignment of references', () => {
    const some = 10;
    chaiExpect(safeCoerce(some, '+=', 10)).to.equal(20);
  });

  it('should fail on coercion of NaN', () => {
    chaiExpect(() => {
      safeCoerce(NaN, '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "NaN" and type "undefined" using "+" operator');
  });

  it('should fail on coercion of array and object', () => {
    chaiExpect(() => {
      safeCoerce([], '+', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Array" and type "Object" using "+" operator');
  });

  it('should fail on coercion of fn and object', () => {
    chaiExpect(() => {
      safeCoerce(() => 1, '+', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Function" and type "Object" using "+" operator');
  });

  it('should fail on coercion of array and object using "-" operator', () => {
    chaiExpect(() => {
      safeCoerce([], '-', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Array" and type "Object" using "-" operator');
  });

  it('should fail on coercion of array and object using "-=" operator', () => {
    chaiExpect(() => {
      safeCoerce([], '-=', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Array" and type "Object" using "-=" operator');
  });

  it('should fail on coercion of null and undefined', () => {
    chaiExpect(() => {
      safeCoerce(null, '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "null" and type "undefined" using "+" operator');
  });

  it('should fail on coercion of array and undefined', () => {
    chaiExpect(() => {
      safeCoerce([], '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Array" and type "undefined" using "+" operator');
  });

  it('should fail on coercion of null and null', () => {
    chaiExpect(() => {
      safeCoerce(null, '+', null);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "null" and type "null" using "+" operator');
  });

  it('should fail on coercion of undefined and undefined', () => {
    chaiExpect(() => {
      safeCoerce(undefined, '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "undefined" and type "undefined" using "+" operator');
  });

  it('should fail on coercion of Object and *', () => {
    chaiExpect(() => {
      safeCoerce({}, '+', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Object" and type "Object" using "+" operator');

    chaiExpect(() => {
      safeCoerce({}, '+', null);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Object" and type "null" using "+" operator');

    chaiExpect(() => {
      safeCoerce({}, '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Object" and type "undefined" using "+" operator');

    chaiExpect(() => {
      safeCoerce({}, '+', []);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Object" and type "Array" using "+" operator');
  });

  it('should fail on coercion of null and null using "+" operator', () => {
    chaiExpect(() => {
      safeCoerce(null, '+', null);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "null" and type "null" using "+" operator');
  });

  it('should fail on coercion of array and array using "-" operator', () => {
    chaiExpect(() => {
      safeCoerce([], '-', []);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "Array" and type "Array" using "-" operator');
  });
});
