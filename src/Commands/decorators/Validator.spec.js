const ValidatorDecorator = require('./Validator')
const Response = require('../Response')

const baseHandler = {
  handle: jest.fn(),
  listenTo: jest.fn()
}

test('Should return an error response when the validator fails', async () => {
  const validator = {
    validate: jest.fn(() => Promise.reject(new Error('Validation failed')))
  }
  const handler = new ValidatorDecorator(baseHandler, validator)
  const command = {}

  const result = await handler.handle(command)

  expect(result).toEqual(Response.withError(new Error('Validation failed')))
})

test('Should return the baseHandler result otherwise', async () => {
  baseHandler.handle.mockResolvedValue(Response.withValue('Success!'))
  const validator = {
    validate: jest.fn().mockResolvedValue(null)
  }
  const handler = new ValidatorDecorator(baseHandler, validator)
  const command = {}

  const result = await handler.handle(command)

  expect(result).toEqual(Response.withValue('Success!'))
})

test('Returns the decorated handler listenTo()', () => {
  baseHandler.listenTo.mockReturnValue('CreateParty')
  const validator = {
    validate: jest.fn()
  }
  const handler = new ValidatorDecorator(baseHandler, validator)

  expect(handler.listenTo()).toEqual('CreateParty')
})
