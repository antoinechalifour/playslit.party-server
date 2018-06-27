const JoinPartyHandler = require('./Handler')
const JoinPartyCommand = require('./Command')
const CommandResponse = require('../Response')
const UserJoinedPartyEvent = require('../../Events/UserJoinedParty/Event')

test('Listens to the correct type', () => {
  const handler = new JoinPartyHandler()

  expect(handler.listenTo()).toBe(require('./Command').COMMAND_TYPE)
})

test('Returns the existing accessToken if it is valid', async () => {
  const party = {
    id: 'party-id',
    name: 'playlist.party',
    code: 'passcode'
  }
  const tokenService = {
    decode: jest.fn().mockResolvedValue({ userId: '12', partyId: 'party-id' }),
    create: jest.fn()
  }
  const partyRepository = {
    findByName: jest.fn().mockResolvedValue(party)
  }
  const userRepository = {
    create: jest.fn(),
    joinParty: jest.fn()
  }
  const handler = new JoinPartyHandler(
    tokenService,
    partyRepository,
    userRepository
  )
  const command = new JoinPartyCommand(
    'playlist.party',
    'passcode',
    'access-token',
    'connection-id'
  )

  const result = await handler.handle(command)

  expect(result.value).toEqual('access-token')
  expect(result.events).toEqual([new UserJoinedPartyEvent('12', 'party-id')])

  expect(userRepository.joinParty.mock.calls.length).toBe(1)
  expect(userRepository.joinParty.mock.calls[0]).toEqual([
    '12',
    'party-id',
    'connection-id'
  ])
})

test('Creates a new user if the token was not delivered to this party', async () => {
  const party = {
    id: 'party-id',
    name: 'playlist.party',
    code: 'passcode'
  }
  const tokenService = {
    decode: jest
      .fn()
      .mockResolvedValue({ userId: '12', partyId: 'other-party' }),
    create: jest.fn().mockResolvedValue('new-access-token')
  }
  const partyRepository = {
    findByName: jest.fn().mockResolvedValue(party)
  }
  const userRepository = {
    create: jest.fn().mockResolvedValue({ id: '13' }),
    joinParty: jest.fn()
  }
  const handler = new JoinPartyHandler(
    tokenService,
    partyRepository,
    userRepository
  )
  const command = new JoinPartyCommand(
    'playlist.party',
    'passcode',
    'access-token',
    'connection-id'
  )

  const result = await handler.handle(command)

  expect(result.value).toEqual('new-access-token')
  expect(result.events).toEqual([new UserJoinedPartyEvent('13', 'party-id')])

  expect(userRepository.joinParty.mock.calls.length).toBe(1)
  expect(userRepository.joinParty.mock.calls[0]).toEqual([
    '13',
    'party-id',
    'connection-id'
  ])
})

test('Creates a new user joining without an access token', async () => {
  const party = {
    id: 'party-id',
    name: 'playlist.party',
    code: 'passcode'
  }
  const tokenService = {
    decode: jest
      .fn()
      .mockResolvedValue({ userId: '12', partyId: 'other-party' }),
    create: jest.fn().mockResolvedValue('new-access-token')
  }
  const partyRepository = {
    findByName: jest.fn().mockResolvedValue(party)
  }
  const userRepository = {
    create: jest.fn().mockResolvedValue({ id: '13' }),
    joinParty: jest.fn()
  }
  const handler = new JoinPartyHandler(
    tokenService,
    partyRepository,
    userRepository
  )
  const command = new JoinPartyCommand(
    'playlist.party',
    'passcode',
    null,
    'connection-id'
  )

  const result = await handler.handle(command)

  expect(result.value).toEqual('new-access-token')
  expect(result.events).toEqual([new UserJoinedPartyEvent('13', 'party-id')])

  expect(userRepository.joinParty.mock.calls.length).toBe(1)
  expect(userRepository.joinParty.mock.calls[0]).toEqual([
    '13',
    'party-id',
    'connection-id'
  ])
})
