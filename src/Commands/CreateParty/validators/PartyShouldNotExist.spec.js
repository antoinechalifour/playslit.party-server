const Command = require('../Command')
const Validator = require('./PartyShouldNotExist')

const partyRepository = {
  findByName: jest.fn()
}

test('Throws an error when the party already exists', () => {
  const existingParty = {
    name: 'my-party',
    code: '1234',
    hostId: 'host-id'
  }
  partyRepository.findByName.mockResolvedValueOnce(existingParty)

  const validator = new Validator(partyRepository)

  return expect(
    validator.validate(new Command('my-party', '0976', 'host-id2'))
  ).rejects.toThrow('Party "my-party" already exists')
})

test('Accepts the command otherwise', () => {
  partyRepository.findByName.mockResolvedValueOnce(null)

  const validator = new Validator(partyRepository)

  return expect(
    validator.validate(new Command('my-party', '0765', 'host-id'))
  ).resolves.toBe(undefined)
})
