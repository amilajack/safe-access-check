/* eslint eqeqeq: 0, no-eval: 0, no-param-reassign: 0, no-return-assign: 0 */

/**
 * Safely access properties and indexs on arrays and objects
 * @TODO: Add `opts` param to allow for configutation of strictness
 */
export function safePropertyAccess(protoChain: Array<string | number>, target: Object) {
  let ref = target;
  let type;

  if (Array.isArray(target)) {
    type = 'Array';
  } else if (target === null) {
    type = 'null';
  } else if (typeof target === 'object') {
    type = 'Object';
  } else {
    type = typeof target;
  }

  const separators: Array<string> = [];

  separators.push(type);

  protoChain.forEach((each: string | number) => {
    if (typeof ref[each] === 'undefined') {
      if (typeof each === 'number') {
        separators.push(`[${each}]`);
      } else {
        separators.push(`.${each}`);
      }
      if (typeof ref.length === 'number') {
        if (each > ref.length - 1) {
          throw new TypeError(`"${separators.join('')}" is out of bounds`);
        }
      }
      throw new TypeError(`"${separators.join('')}" is not defined`);
    } else {
      if (typeof each === 'number') {
        separators.push(`[${each}]`);
      } else {
        separators.push(`.${each}`);
      }
      ref = ref[each];
    }
  });

  return target;
}

function formatType(type: any): string {
  if (Array.isArray(type)) return 'array';
  if (Number.isNaN(type)) return 'NaN';
  if (type === null) return 'null';
  return typeof type;
}

/**
 * Allow only adding and subtracting numbers or strings
 */
export function safeCoerce(left: any, operator: string, right: any) {
  const errorMessage =
    `Unexpected coercion of type "${formatType(left)}" and type "${formatType(right)}" using "${operator}" operator`;

  if (Number.isNaN(left) || Number.isNaN(right)) {
    throw new TypeError(errorMessage);
  }

  if (!((
    typeof left === 'string' ||
    typeof left === 'number' ||
    left instanceof String
  ) && (
    typeof right === 'string' ||
    typeof right === 'number' ||
    right instanceof String
  ))) {
    throw new TypeError(errorMessage);
  }

  if (operator === '-=') { return left -= right; }
  if (operator === '=-') { return left = -right; }
  if (operator === '+=') { return left += right; }
  if (operator === '=+') { return left = +right; }
  if (operator === '+') { return left + right; }
  if (operator === '-') { return left - right; }

  return eval(`${left} ${operator} ${right}`);
}

// @TODO
export function safeMethodCall(): string {}

// @TODO
// function disallowAbstractEqualityComparison() {}
