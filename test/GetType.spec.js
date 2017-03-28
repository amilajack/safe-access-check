import { getType } from '../src/index';


describe('getType', () => {
  describe('String', () => {
    it('should get type string', () => {
      expect(getType('string')).toEqual('string');
    });

    it('should get type of new string', () => {
      expect(getType(new String('string'))).toEqual('string'); // eslint-disable-line
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
