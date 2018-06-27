const Command = require('../Command')
const Validator = require('./CheckPasscode')

const partyRepository = {
  findByName: jest.fn()
}

test('Throws an error the passcode is invalid', () => {
  const party = {
    partyName: 'my-party',
    code: '2345',
    hostId: 'host-id'
  }
  partyRepository.findByName.mockResolvedValueOnce(party)

  const validator = new Validator(partyRepository)

  return expect(
    validator.validate(new Command('my-party', '1234', null, 'connection-id'))
  ).rejects.toThrow('Invalid passcode for party "my-party"')
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
    validator.validate(new Command('my-party', '9876', null, 'connection-id'))
  ).resolves.toBe(undefined)
})
