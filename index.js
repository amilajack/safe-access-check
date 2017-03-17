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

/**
 * Allow only adding and subtracting numbers or strings
 */
export function safeCoerce(left: any, operator: string, right: any) {
  // Validate left
  if (!(
    typeof left === 'string' ||
    typeof left === 'number' ||
    typeof right === 'string' ||
    typeof right === 'number' ||
    left.constructor == String ||
    right.constructor == String
  )) {
    throw new TypeError(
      `Unexpected coercion of type "${typeof left}" and type "${typeof right}" using "${operator}" operator`
    );
  }

  if (operator === '-=') { return left -= right; }
  if (operator === '=-') { return left = -right; }
  if (operator === '+=') { return left += right; }
  if (operator === '=+') { return left = +right; }
  if (operator === '+') { return left + right; }
  if (operator === '-') { return left - right; }

  return eval(`${left} ${operator} ${right}`);
}

global.safePropertyAccess = safePropertyAccess;
global.safeCoerce = safeCoerce;

// @TODO
// function disallowAbstractEqualityComparison() {}

