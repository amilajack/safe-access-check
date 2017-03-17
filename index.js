/**
 * Safely access properties and indexs on arrays and objects
 */
export function safePropertyAccess(protoChain: Array<string>, target: Object) {
  let ref = target;

  protoChain.forEach((each, index) => {
    if (typeof ref[each] === 'undefined') {
      if (typeof ref.length === 'number') {
        throw new TypeError(`"${protoChain.splice(0, index + 1).join('.')}" is out of bounds`);
      }
      throw new TypeError(`"${protoChain.splice(0, index + 1).join('.')}" is not defined`);
    } else {
      ref = ref[each];
    }
  });

  return target;
}

function _formatType(type: any): string {
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
    `Unexpected coercion of type "${_formatType(left)}" and type "${_formatType(right)}" using "${operator}" operator`

  if (Number.isNaN(left) || Number.isNaN(right)) {
    throw new TypeError(errorMessage);
  }

  if (!((
    typeof left === 'string' ||
    typeof left === 'number' ||
    left.constructor == String
  ) && (
    typeof right === 'string' ||
    typeof right === 'number' ||
    right.constructor == String
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
// function disallowAbstractEqualityComparison() {}

global.safePropertyAccess = safePropertyAccess;
global.safeCoerce = safeCoerce;
