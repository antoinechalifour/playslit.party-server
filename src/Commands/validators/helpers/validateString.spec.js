const validateString = require('./validateString')

const rejected = [
  undefined,
  null,
  false,
  true,
  function () {},
  [],
  {},
  /a/g,
  new RegExp('a', 'g'),
  new Date(),
  42,
  NaN,
  Infinity,
  new Number(42)
]

rejected.forEach(value =>
  test(`Throws an exception when property is of type "${typeof value}"`, () => {
    expect(() => validateString(value)).toThrow(
      `Expected value to be of type "string", got "${typeof value}"`
    )
  })
)

test('Does not throw when the property is a string', () => {
  expect(() => validateString('some string')).not.toThrow()
})
