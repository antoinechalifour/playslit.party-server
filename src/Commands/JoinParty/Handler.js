const JoinPartyCommand = require('./Command')
const CommandResponse = require('../Response')
const UserJoinedPartyEvent = require('../../Events/UserJoinedParty/Event')

module.exports = class JoinPartyCommandHandler {
  constructor (tokenService, partyRepository, userRepository) {
    this.tokenService = tokenService
    this.partyRepository = partyRepository
    this.userRepository = userRepository
  }

  /**
   * Handles JoinParty commands.
   * @param {JoinPartyCommand} command - The command to handle
   */
  async handle (command) {
    const party = await this.partyRepository.findByName(command.partyName)

    if (command.accessToken) {
      try {
        const decodedToken = await this.tokenService.decode(command.accessToken)

        if (decodedToken.partyId === party.id) {
          await this.userRepository.joinParty(
            decodedToken.userId,
            party.id,
            command.connectionId
          )

          return CommandResponse.withValue(
            command.accessToken,
            new UserJoinedPartyEvent(decodedToken.userId, party.id)
          )
        }
      } catch (err) {
        // Failed to decode token. Ignore and re-create a user.
      }
    }

    // The user cannot re-use its access token, we need to create a new user / access token
    const user = await this.userRepository.create()
    const accessToken = await this.tokenService.create({
      userId: user.id,
      partyId: party.id
    })

    await this.userRepository.joinParty(user.id, party.id, command.connectionId)

    return CommandResponse.withValue(
      accessToken,
      new UserJoinedPartyEvent(user.id, party.id)
    )
  }

  listenTo () {
    return JoinPartyCommand.COMMAND_TYPE
  }
}
