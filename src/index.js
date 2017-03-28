/* eslint eqeqeq: 0, no-eval: 0, no-param-reassign: 0, no-return-assign: 0 */

type supportedTypes
  = 'string' | 'String' | 'Array' | 'Function' | 'Object' | 'number' | 'Number' | 'NaN' | 'null' | 'undefined';

export function getType(target: any): supportedTypes {
  if (Array.isArray(target)) {
    return 'Array';
  } else if (target === null) {
    return 'null';
  }
  if (Number.isNaN(target)) {
    return 'NaN';
  } else if (target instanceof Number) {
    return 'Number';
  } else if (target instanceof String) {
    return 'String';
  } else if (typeof target === 'function') {
    return 'Function';
  } else if (typeof target === 'object') {
    return 'Object';
  }
  return typeof target;
}

/**
 * Safely access properties and indexs on arrays and objects
 * @TODO: Add `opts` param to allow for configutation of strictness
 */
export function safePropertyAccess(protoChain: Array<string | number>, target: Object) {
  let ref = target;
  let type: string = getType(ref);
  const separators: Array<string> = [];

  separators.push(type);

  protoChain.forEach((each: string | number) => {
    // If type of
    if (!(type === 'Array' || type === 'Object' || type === 'Function')) {
      throw new TypeError(`Cannot access property "${each}" on type "${type}" (${separators.join('')})`);
    }

    // Check if the access not defined, throw error and append proto to
    // `separators`
    if (each in ref) {
      if (typeof each === 'number') {
        separators.push(`[${each}]`);
      } else {
        separators.push(`.${each}`);
      }
      ref = ref[each];
      type = getType(ref);
    } else {
      // Check if the access an array access
      if (typeof each === 'number') {
        separators.push(`[${each}]`);
      }
      if (Array.isArray(ref)) {
        if (each > ref.length - 1) {
          throw new TypeError(`"${separators.join('')}" is out of bounds`);
        }
      }
      if (!(typeof each === 'string' || typeof each === 'number')) {
        throw new TypeError(`Type "${getType(each)}" cannot be used to access ${separators.join('')}`);
      }
      throw new TypeError(`Property "${each}" does not exist in "${separators.join('')}"`);
    }
  });

  return ref;
}

/**
 * Allow only adding and subtracting numbers or strings
 */
export function safeCoerce(left: any, operator: string, right: any) {
  const errorMessage =
    `Unexpected coercion of type "${getType(left)}" and type "${getType(right)}" using "${operator}" operator`;

  if (Number.isNaN(left) || Number.isNaN(right)) {
    throw new TypeError(errorMessage);
  }

  // Terse way of handling both type 'string' and 'String'
  const leftLowercaseType = getType(left).toLowerCase();
  const rightLowercaseType = getType(right).toLowerCase();

  if (!((
    leftLowercaseType === 'string' ||
    leftLowercaseType === 'number'
  ) && (
    rightLowercaseType === 'string' ||
    rightLowercaseType === 'number'
  ))) {
    throw new TypeError(errorMessage);
  }

  if (operator === '-=') { return left -= right; }
  if (operator === '=-') { return left = -right; }
  if (operator === '+=') { return left += right; }
  if (operator === '=+') { return left = +right; }
  if (operator === '+') { return left + right; }
  if (operator === '-') { return left - right; }

  // Check if is comparison
  if (operator.includes('>') || operator.includes('<')) {
    if (leftLowercaseType !== rightLowercaseType) {
      const comparisonErrorMessage =
        `Unexpected comparison of type "${getType(left)}" and type "${getType(right)}" using "${operator}" operator`;
      throw new TypeError(comparisonErrorMessage);
    }
  }

  return eval(
    [
      leftLowercaseType === 'string' ? `"${left}"` : left,
      operator,
      rightLowercaseType === 'string' ? `"${right}"` : right
    ]
    .join(' ')
  );
}

// @TODO
export function safeMethodCall(): string {}

// @TODO
// function disallowAbstractEqualityComparison() {}
