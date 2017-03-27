import { expect as chaiExpect } from 'chai';
import { safePropertyAccess } from '../src/index';


describe('Safe Property Access', () => {
  it('should access simply nested objects', () => {
    safePropertyAccess(['soo', 'moo'], {
      soo: {
        moo: true
      }
    });
  });

  it('should fail on access of single depth', () => {
    chaiExpect(() => {
      safePropertyAccess(['soo', 'moo'], {});
    })
    .to.throw(TypeError, 'Property "soo" does not exist in "Object"');
  });

  it('should access deeply nested objects', () => {
    safePropertyAccess(['woo', 'loo', 'hi'], {
      soo: {
        who: true
      },
      woo: {
        loo: {
          hi: false
        }
      }
    });
  });

  it('should access defined array values', () => {
    safePropertyAccess(['woo', 0], {
      woo: [false]
    });
  });

  describe('Array Access', () => {
    describe('Return Values', () => {
      it('should access mixed objects', () => {
        expect(safePropertyAccess(['woo', 1], {
          woo: [false, true]
        }))
        .toEqual(true);
      });

      it('should access deeply nested values', () => {
        expect(safePropertyAccess([0, 0, 0, 0], [[[['foo']]]]))
          .toEqual('foo');
      });

      it('should fail on object literal access', () => {
        chaiExpect(() => {
          safePropertyAccess([{}], [[[['foo']]]]);
        })
        .to.throw(TypeError, 'Type "object" cannot be used to access Array');

        chaiExpect(() => {
          safePropertyAccess(['some', {}], { some: {} });
        })
        .to.throw(TypeError, 'Type "object" cannot be used to access Object.some');
      });

      it('should fail on function access', () => {
        const fn = () => 1;
        chaiExpect(() => {
          safePropertyAccess([fn], [1, 2, 3]);
        })
        .to.throw(TypeError, 'Type "function" cannot be used to access Array');

        chaiExpect(() => {
          safePropertyAccess([0, fn], [[1, 2, 3]]);
        })
        .to.throw(TypeError, 'Type "function" cannot be used to access Array[0]');
      });

      it('should access property names with string Object', () => {
        const property = new String('some'); // eslint-disable-line
        const property2 = new String('moo'); // eslint-disable-line
        expect(safePropertyAccess([property], { some: 'foo' })).toEqual('foo');
        expect(safePropertyAccess([property, property2], { some: { moo: 'doo' } })).toEqual('doo');

        chaiExpect(() => {
          safePropertyAccess([property, 'soo'], { some: { doo: 'moo' } });
        })
        .to.throw(TypeError, 'Property "soo" does not exist in "Object.some"');
      });

      it('should succeed on iffe access', () => {
        const fn = () => 1;
        expect(safePropertyAccess([fn()], [1, 2, 3])).toEqual(2);
      });

      it('should access deeply nested object properties', () => {
        expect(safePropertyAccess(['foo', 'bar', 'baz'], {
          foo: {
            bar: {
              baz: 'baz'
            }
          }
        }))
        .toEqual('baz');
      });

      it('should fail on access of incorrect type', () => {
        chaiExpect(() => {
          safePropertyAccess(['foo', 'bar', 'baz'], {
            foo: undefined
          });
        })
        .to.throw(TypeError, 'Cannot access property "bar" on type "undefined" (Object.foo)');
      });
    });

    it('should fail on out of bounds array access', () => {
      chaiExpect(() => {
        safePropertyAccess(['woo', 1], {
          woo: [false]
        });
      })
      .to.throw(TypeError, '"Object.woo[1]" is out of bounds');

      chaiExpect(() => {
        safePropertyAccess([0, 0, 0], ['', ['', ['']]]);
      })
      .to.throw(TypeError, 'Cannot access property "0" on type "string" (Array[0])');

      expect(safePropertyAccess([0, 0, 0], [[['']]])).toEqual('');
    });

    it('should pass on in-bound array access', () => {
      chaiExpect(() => {
        safePropertyAccess([2, 3, 0], ['', '', ['', '', '', ['']]]);
      });
    });

    it('should fail on out of bound array access', () => {
      chaiExpect(() => {
        safePropertyAccess([2, 3, 10], ['', '', ['', '', '', ['']]]);
      })
      .to.throw(TypeError, '"Array[2][3][10]" is out of bounds');
    });
  });

  it('should fail on undefined objects', () => {
    chaiExpect(() => {
      safePropertyAccess(['soo', 'moo'], {
        soo: {
          who: true
        }
      });
    })
    .to.throw(TypeError, 'Property "moo" does not exist in "Object.soo"');
  });

  it('should handle multiple object levels', () => {
    chaiExpect(() => {
      safePropertyAccess(['woo', 'loo', 'hi'], {
        soo: {
          who: true
        },
        woo: {
          loo: {
            no: false
          }
        }
      });
    })
    .to.throw(TypeError, 'Property "hi" does not exist in "Object.woo.loo"');

    chaiExpect(() => {
      safePropertyAccess(['foo', 'bar', '_MOO_', 'baz'], {
        foo: {
          bar: {
            baz: ''
          }
        }
      });
    })
    .to.throw(TypeError, 'Property "_MOO_" does not exist in "Object.foo.bar"');
  });
});
