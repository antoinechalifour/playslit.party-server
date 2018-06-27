const CreatePartyCommand = require('./Command')
const CommandResponse = require('../Response')

module.exports = class CreatePartyHandler {
  /**
   * Builds the handler.
   * @param {{ findByName: name => Promise>}} partyRepository
   */
  constructor (userRepository, partyRepository) {
    this.userRepository = userRepository
    this.partyRepository = partyRepository
  }

  /**
   * Handles the CreateParty command.
   * @param {{ partyName: string, code: string, hostId: string}} command - The command.
   */
  async handle (command) {
    const user = await this.userRepository.create()
    const party = await this.partyRepository.create(
      command.partyName,
      command.code,
      user.id
    )

    await this.userRepository.joinAsCreator(user.id, party.id, command.hostId)

    return CommandResponse.withValue(party.id)
  }

  listenTo () {
    return CreatePartyCommand.COMMAND_TYPE
  }
}
