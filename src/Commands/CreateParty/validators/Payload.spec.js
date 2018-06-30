const Validator = require('./Payload')
const Command = require('../Command')

const rejectedValues = {
  partyName: [
    new Command(null, '1234', 'host-id'),
    new Command('', '1234', 'host-id'),
    new Command('my party', '1234', 'host-id'),
    new Command('My party', '1234', 'host-id'),
    new Command('My%party', '1234', 'host-id'),
    new Command('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '1234', 'host-id')
  ],
  code: [
    new Command('my-party', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'host-id'),
    new Command('my-party', null, 'host-id'),
    new Command('my-party', '', 'host-id')
  ],
  hostId: [new Command('my-party', '1234', null)]
}

const acceptedValues = [
  new Command('my_party', 'test', 'host-id'),
  new Command('my-party', '1234', 'host-id'),
  new Command('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '1234', 'host-id'), // Max length: 30chars
  new Command('my-party', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'host-id') // Max length: 30chars
]

Object.keys(rejectedValues).forEach(erroredField => {
  const commands = rejectedValues[erroredField]
  const validator = new Validator()

  commands.forEach(command =>
    test(`Rejects command ${JSON.stringify(command)}`, () => {
      expect(() => validator.validate(command)).toThrow(
        `Invalid argument ${erroredField}`
      )
    })
  )
})

acceptedValues.forEach(command =>
  test(`Accepts command ${JSON.stringify(command)}`, () => {
    const validator = new Validator()

    expect(() => validator.validate(command)).not.toThrow()
  })
)
