import { expect } from 'chai';
import { safeCoerce, safePropertyAccess } from '../index';


describe('Safe Coerce', () => {
  it('should return values that pass', () => {
    expect(safeCoerce(1, '+', 1,)).to.equal(2);
    expect(safeCoerce(10, '-', 10, )).to.equal(0);
  });

  it('should allow string concat', () => {
    expect(safeCoerce('moo', '+', 10, )).to.equal('moo10');
  });

  it('should allow string concat reassignment', () => {
    const some = 'moo';
    expect(safeCoerce(some, '+=', 10, )).to.equal('moo10');
    expect(safeCoerce(10, '+', some, )).to.equal('10moo');
  });

  it('should allow new String() concat', () => {
    expect(safeCoerce(new String('moo'), '+=', 10, )).to.equal('moo10');
    expect(safeCoerce(new String('moo'), '+', new String('moo'), )).to.equal('moomoo');
  });

  it('should allow reassignment', () => {
    const some = 10;
    expect(safeCoerce(some, '+=', 10)).to.equal(20);
  });

  it('should fail on coercion of array and object', () => {
    expect(() => {
      safeCoerce([], '+', {}, );
    })
    .to.throw(TypeError, 'Unexpected coercion of type "object" and type "object" using "+" operator');
  });

  it('should fail on coercion of array and object', () => {
    expect(() => {
      safeCoerce([], '-', {}, );
    })
    .to.throw(TypeError, 'Unexpected coercion of type "object" and type "object" using "-" operator');
  });

  it('should fail on coercion of array and object', () => {
    expect(() => {
      safeCoerce([], '-=', {}, );
    })
    .to.throw(TypeError, 'Unexpected coercion of type "object" and type "object" using "-=" operator');
  });

  it('should fail on coercion of array and object', () => {
    expect(() => {
      safeCoerce([], '-', [], );
    })
    .to.throw(TypeError, 'Unexpected coercion of type "object" and type "object" using "-" operator');
  });
});

describe('Safe Property Access', () => {
  it('should access simply nested objects', () => {
    safePropertyAccess(['soo', 'moo'], {
      soo: {
        moo: true
      }
    });
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

  it('should fail on undefined array values', () => {
    expect(() => {
      safePropertyAccess(['woo', 1], {
        woo: [false]
      });
    })
    .to.throw(TypeError, '"woo.1" is out of bounds');
  });

  it('should fail on undefined objects', () => {
    expect(() => {
      safePropertyAccess(['soo', 'moo'], {
        soo: {
          who: true
        }
      });
    })
    .to.throw(TypeError, '"soo.moo" is not defined');
  });

  it('should handle multiple object levels', () => {
    expect(() => {
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
    .to.throw(TypeError, '"woo.loo.hi" is not defined');
  });
});
