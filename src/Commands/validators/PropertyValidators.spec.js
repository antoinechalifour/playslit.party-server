const Validator = require('./PropertyValidator')

test('Throws the validator helper throws', () => {
  const validatorHelper = jest.fn(() => {
    throw new Error('Test helper validator')
  })

  const validator = new Validator('partyName', validatorHelper)
  const command = { partyName: 'test' }

  return expect(validator.validate(command)).rejects.toThrow(
    'Test helper validator'
  )
})

test('Accepts the command otherwise', async () => {
  const validatorHelper = jest.fn(() => Promise.resolve(null))
  const validator = new Validator('partyName', validatorHelper)
  const command = { partyName: 'test' }

  const result = await validator.validate(command)

  expect(result).toBeUndefined()
  expect(validatorHelper.mock.calls.length).toBe(1)
  expect(validatorHelper.mock.calls[0]).toEqual(['test'])
})
