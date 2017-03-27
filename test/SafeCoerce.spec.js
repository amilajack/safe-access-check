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
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "object" using "+" operator');
  });

  it('should fail on coercion of fn and object', () => {
    chaiExpect(() => {
      safeCoerce(() => 1, '+', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "function" and type "object" using "+" operator');
  });


  it('should fail on coercion of array and object using "-" operator', () => {
    chaiExpect(() => {
      safeCoerce([], '-', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "object" using "-" operator');
  });

  it('should fail on coercion of array and object using "-=" operator', () => {
    chaiExpect(() => {
      safeCoerce([], '-=', {});
    })
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "object" using "-=" operator');
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
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "undefined" using "+" operator');
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
    .to.throw(TypeError, 'Unexpected coercion of type "array" and type "array" using "-" operator');
  });
});
