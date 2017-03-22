import { expect } from 'chai';
import {
  safeCoerce,
  safeMethodCall,
  safePropertyAccess,
} from '../src/index';


/* eslint no-new-wrappers: 0 */

describe.skip('Safe Method Call', () => {
  expect(() => {
    const obj = {
      some() {},
    };
    safeMethodCall(obj, 'foo');
  })
  .to.throw(TypeError, 'Method "foo" does not exist in given object');
});

describe('Safe Coerce', () => {
  it('should return values that pass', () => {
    expect(safeCoerce(1, '+', 1)).to.equal(2);
    expect(safeCoerce(10, '-', 10)).to.equal(0);
  });

  it('should allow string concat', () => {
    expect(safeCoerce('moo', '+', 10)).to.equal('moo10');
  });

  it('should allow string concat reassignment', () => {
    const some = 'moo';
    expect(safeCoerce(some, '+=', 10)).to.equal('moo10');
    expect(safeCoerce(10, '+', some)).to.equal('10moo');
  });

  it('should allow new String() concat', () => {
    expect(safeCoerce(new String('moo'), '+=', 10)).to.equal('moo10');
    expect(safeCoerce(new String('moo'), '+', new String('moo'))).to.equal('moomoo');
  });

  it('should allow reassignment of references', () => {
    const some = 10;
    expect(safeCoerce(some, '+=', 10)).to.equal(20);
  });

  it('should fail on coercion of NaN', () => {
    expect(() => {
      safeCoerce(NaN, '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "NaN" and type "undefined" using "+" operator');
  });

  it('should fail on coercion of array and object', () => {
    expect(() => {
      safeCoerce([], '+', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "object" using "+" operator');
  });

  it('should fail on coercion of array and object', () => {
    expect(() => {
      safeCoerce([], '-', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "object" using "-" operator');
  });

  it('should fail on coercion of array and object', () => {
    expect(() => {
      safeCoerce([], '-=', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "object" using "-=" operator');
  });

  it('should fail on coercion of null and undefined', () => {
    expect(() => {
      safeCoerce(null, '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "null" and type "undefined" using "+" operator');
  });

  it('should fail on coercion of array and undefined', () => {
    expect(() => {
      safeCoerce([], '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "undefined" using "+" operator');
  });

  it('should fail on coercion of null and null', () => {
    expect(() => {
      safeCoerce(null, '+', null);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "null" and type "null" using "+" operator');
  });

  it('should fail on coercion of undefined and undefined', () => {
    expect(() => {
      safeCoerce(undefined, '+', undefined);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "undefined" and type "undefined" using "+" operator');
  });

  it('should fail on coercion of null and null', () => {
    expect(() => {
      safeCoerce(null, '+', null);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "null" and type "null" using "+" operator');
  });

  it('should fail on coercion of array and object', () => {
    expect(() => {
      safeCoerce([], '-', []);
    })
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "array" using "-" operator');
  });
});

describe('Safe Property Access', () => {
  it('should access simply nested objects', () => {
    safePropertyAccess(['soo', 'moo'], {
      soo: {
        moo: true,
      },
    });
  });

  it('should fail on access of single depth', () => {
    expect(() => {
      safePropertyAccess(['soo', 'moo'], {});
    })
    .to.throw(TypeError, 'Property "soo" does not exist in "Object"');
  });

  it('should access deeply nested objects', () => {
    safePropertyAccess(['woo', 'loo', 'hi'], {
      soo: {
        who: true,
      },
      woo: {
        loo: {
          hi: false,
        },
      },
    });
  });

  it('should access defined array values', () => {
    safePropertyAccess(['woo', 0], {
      woo: [false],
    });
  });

  describe('Array Access', () => {
    describe('Return Values', () => {
      it('should access mixed objects', () => {
        expect(safePropertyAccess(['woo', 1], {
          woo: [false, true],
        }))
        .to.equal(true);
      });

      it('should access deeply nested values', () => {
        expect(safePropertyAccess([0, 0, 0, 0], [[[['foo']]]]))
          .to.equal('foo');
      });

      it('should access deeply nested object properties', () => {
        expect(safePropertyAccess(['foo', 'bar', 'baz'], {
          foo: {
            bar: {
              baz: 'baz',
            },
          },
        }))
        .to.equal('baz');
      });

      it('should fail on access of incorrect type', () => {
        expect(() => {
          safePropertyAccess(['foo', 'bar', 'baz'], {
            foo: undefined,
          });
        })
        .to.throw(TypeError, 'Cannot access property "bar" on type "undefined"');
      });
    });

    it('should fail on out of bounds array access', () => {
      expect(() => {
        safePropertyAccess(['woo', 1], {
          woo: [false],
        });
      })
      .to.throw(TypeError, '"Object.woo[1]" is out of bounds');

      expect(() => {
        safePropertyAccess([0, 0, 0], ['', ['', ['']]]);
      })
      .to.throw(TypeError, 'Cannot access property "0" on type "string"');

      expect(safePropertyAccess([0, 0, 0], [[['']]])).to.equal('');
    });

    it('should pass on in-bound array access', () => {
      expect(() => {
        safePropertyAccess([2, 3, 0], ['', '', ['', '', '', ['']]]);
      });
    });

    it('should fail on out of bound array access', () => {
      expect(() => {
        safePropertyAccess([2, 3, 10], ['', '', ['', '', '', ['']]]);
      })
      .to.throw(TypeError, '"Array[2][3][10]" is out of bounds');
    });
  });

  it('should fail on undefined objects', () => {
    expect(() => {
      safePropertyAccess(['soo', 'moo'], {
        soo: {
          who: true,
        },
      });
    })
    .to.throw(TypeError, 'Property "moo" does not exist in "Object.soo"');
  });

  it('should handle multiple object levels', () => {
    expect(() => {
      safePropertyAccess(['woo', 'loo', 'hi'], {
        soo: {
          who: true,
        },
        woo: {
          loo: {
            no: false,
          },
        },
      });
    })
    .to.throw(TypeError, 'Property "hi" does not exist in "Object.woo.loo"');

    expect(() => {
      safePropertyAccess(['foo', 'bar', '_MOO_', 'baz'], {
        foo: {
          bar: {
            baz: '',
          },
        },
      });
    })
    .to.throw(TypeError, 'Property "_MOO_" does not exist in "Object.foo.bar"');
  });
});
