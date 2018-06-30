const assert = require('assert')

/**
 * Throws if the value is not a string.
 * @param {any} value - The candidate value.
 */
const validateString = value =>
  assert(
    typeof value === 'string',
    `Expected value to be of type "string", got "${typeof value}"`
  )

module.exports = validateString
