const Command = require('../Command')
const Validator = require('./PartyShouldExist')

const partyRepository = {
  findByName: jest.fn()
}

test('Throws an error when the party does not exists', () => {
  partyRepository.findByName.mockResolvedValueOnce(null)

  const validator = new Validator(partyRepository)

  return expect(
    validator.validate(new Command('my-party', '1234', null, 'connection-id'))
  ).rejects.toThrow('Party "my-party" does not exist')
})

test('Does not throw otherwise', () => {
  const party = {
    partyName: 'my-party',
    code: '9876',
    hostId: 'host-id'
  }
  partyRepository.findByName.mockResolvedValueOnce(party)

  const validator = new Validator(partyRepository)

  return expect(
    validator.validate(new Command('my-party', '1234', null, 'connection-id'))
  ).resolves.toBe(undefined)
})
