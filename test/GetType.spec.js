import { getType } from '../src/index';


describe('getType', () => {
  describe('String/string', () => {
    it('should get type string', () => {
      expect(getType('string')).toEqual('string');
    });

    it('should get type of new string', () => {
      expect(getType(new String('string'))).toEqual('String'); // eslint-disable-line
    });
  });

  describe('Number/number', () => {
    it('should get type of new number', () => {
      expect(getType(new Number(12))).toEqual('Number'); // eslint-disable-line
      expect(getType(new Number('12'))).toEqual('Number'); // eslint-disable-line
    });
    it('should get type of number', () => {
      expect(getType(12)).toEqual('number');
    });
  });

  describe('Array', () => {
    it('should get type of new array', () => {
      expect(getType(new Array(12))).toEqual('Array'); // eslint-disable-line
      expect(getType([])).toEqual('Array'); // eslint-disable-line
    });
  });

  describe('Object', () => {
    it('should get type of new Object', () => {
      expect(getType(new Object())).toEqual('Object'); // eslint-disable-line
      expect(getType({})).toEqual('Object'); // eslint-disable-line
    });
  });

  describe('NaN', () => {
    it('should get type of NaN', () => {
      expect(getType(NaN)).toEqual('NaN');
    });
  });

  describe('null', () => {
    it('should get type of null', () => {
      expect(getType(null)).toEqual('null');
    });
  });

  describe('undefined', () => {
    it('should get type of undefined', () => {
      expect(getType(undefined)).toEqual('undefined');
    });
  });

  describe('Function', () => {
    it('should get type of arrow function', () => {
      expect(getType(() => {})).toEqual('Function');
    });

    it('should get type of class', () => {
      expect(getType(class Some {})).toEqual('Function');
    });

    it('should get type of function declaration', () => {
      expect(getType(function Foo() {})).toEqual('Function'); // eslint-disable-line
    });
  });
});
